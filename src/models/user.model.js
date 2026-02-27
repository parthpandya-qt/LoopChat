import mongoose,{Schema} from "mongoose";

const userSchema = Schema(
    {   


        fullName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        profilePicture:{
            type:String,
            default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }

    },
    {timestamps:true})
    
    
userSchema.pre("save",async function(){
    if(!this.isModified(password)){
            return 
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordcorrect = function(password){
    return bcrypt.compare(this.password,password)
}

userSchema.methods.genereateRefreshtoken = function(){
    return jwt.sign(
        {_id:this.id,fullName:this.fullname,email:this.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )
}
userSchema.methods.genereateRefreshtoken = function(){
    return jwt.sign(
        {_id:this.id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User",userSchema);