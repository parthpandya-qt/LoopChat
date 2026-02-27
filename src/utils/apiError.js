class ApiError extends Error{
    constructor(statusCode , message = "some error occured" , errors=[],stack=''){
        super(message)
        this.statusCode=statusCode;
        this.errors=errors;
        this.success=false;
        this.data=null;
        if(stack){
            this.stack=stack
        }else[
            Error.captureStackTrace(this,this.constructor)
            
        ]
        }
}

export {ApiError};