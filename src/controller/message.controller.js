import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {User} from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { generateToken } from "../utils/generateToken.js";
import { ApiError } from "../utils/apiError.js";
import upLoadonCloudinary from "../utils/cloudinary.js";
import { deleteFromCloudinaryByUrl } from "../utils/deletefile.js";


const userLeftBar = AsyncHandler(async(req,res)=>{
        try {
            const user = await User.find({_id : {$ne:req.user?._id}}).select("-password -refreshToken")
            return res
                .status(200)
                .json(new ApiResponse(200,user,"all the friends"))
        } catch (error) {
            throw new ApiError(400, error.message)
        }
})
                         
const getMessagesByUserId = AsyncHandler(async(req,res)=>{
    const usertoChatId = req.params.id;

    const myId = req.user?._id;

    if (!myId) {
        throw new ApiError(401, "Unauthorized");
    }
    try {
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiver: usertoChatId },
                { senderId: usertoChatId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        return res
            .status(200)
            .json(new ApiResponse(200,messages,"Messages retrieved successfully"))
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})
const postMessage = AsyncHandler(async(req,res)=>{
    const {text,image}
})
export {userLeftBar,getMessagesByUserId,postMessage}