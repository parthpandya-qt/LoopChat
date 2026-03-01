import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {User} from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { ApiError } from "../utils/apiError.js";
import upLoadonCloudinary from "../utils/cloudinary.js";
import { deleteFromCloudinaryByUrl } from "../utils/deletefile.js";


const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const userSignUp = AsyncHandler(async(req,res)=>{
    const {fullName,email,password} = req.body;
    if ([fullName, email, password]
        .some(field => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    if(password.length < 6){
        throw new ApiError(400, "Password must be at least 6 characters long")
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { fullName }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    let avatar;

    if (req.file?.path) {
        const uploadedAvatar = await upLoadonCloudinary(req.file.path);
        avatar = uploadedAvatar?.url;
    } else {
        avatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
}

const user = await User.create({
    fullName,
    email,
    password,
    profilePicture: avatar
});
const {accessToken,refreshToken} = await generateToken(user._id)

const storedUser = await User.findByIdAndUpdate(user._id,{refreshToken:refreshToken},{new:true}).select("-password -refreshToken");
if (!storedUser) {
    throw new ApiError(500, "User not found after creation");
}

return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,storedUser,"User created successfully"))
});



const userLogin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Both email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isValid = await user.isPasswordCorrect(password);

    if (!isValid) {
        throw new ApiError(401, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await generateToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "Login successful"
            )
        );
});

const userLogout = AsyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {$unset:{refreshToken:1}},
        {new:true}
    )
    return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new ApiResponse(200,{},"logged out success fully"))
})


const refreshAccessToken = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user || !user.refreshToken) {
        throw new ApiError(401, "Unauthorized");
    }
    const { accessToken, refreshToken } = await generateToken(user._id);

    await User.findByIdAndUpdate(
        userId,
        { refreshToken },
        { new: true }
    );
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
});

const updateProfile = AsyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
}

    const { fullName } = req.body;
    const localAvatarPath = req.file?.path;

    if (!fullName && !localAvatarPath) {
        throw new ApiError(400, "Nothing to update");
}


    if (fullName) {
        user.fullName = fullName.trim();
}


    if (localAvatarPath) {

    const oldAvatar = user.profilePicture;

    const uploadedAvatar = await upLoadonCloudinary(localAvatarPath);

    if (!uploadedAvatar?.url) {
        throw new ApiError(500, "Avatar upload failed");
    }

    user.profilePicture = uploadedAvatar.url;

    await user.save({ validateBeforeSave: false });


    if (oldAvatar && oldAvatar.includes("cloudinary")) {
        await deleteFromCloudinaryByUrl(oldAvatar);
    }

    } else {
    await user.save({ validateBeforeSave: false });
    }


    user.password = undefined;
    user.refreshToken = undefined;

    return res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully")
    );

});
const checkAuth = AsyncHandler(async (req, res) => {
    try {
        return res.status(200)
        .json(new ApiResponse(200, req.user, "User authenticated"));
    } catch (error) {
        throw new ApiError(401, error.message || "Unauthorized");
};
})
export {userSignUp,userLogin,userLogout,refreshAccessToken,updateProfile,checkAuth};