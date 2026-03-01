import mongoose ,{Schema} from "mongoose";
import { User } from "./user.model.js";


const messageSchema = Schema(
    {
        senderID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:User,
            required:true
        },
        receiverID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:User,
            required:true
        },
        text:{
            type:String
        },
        image:{
            type:String
        }
    },
    {timestamps:true}
)

export const Message = mongoose.model("Message",messageSchema)