import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {User} from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { ApiError } from "../utils/apiError.js";


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
    const user = await User.create({
    fullName,
    email,
    password
});
const {accessToken,refreshToken} = await generateToken(user._id)

const storedUser = await User.findById(user._id).select("-password -refreshToken");
if (!storedUser) {
    throw new ApiError(500, "User not found after creation");
}

return res
        .status(200)
        .cookie("accessToken",accessToken,options)
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
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken },
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
            .json(new ApiResponse(200,{},"logged out success fully"))
})

export {userSignUp,userLogin,userLogout}