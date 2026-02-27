import mongoose from "mongoose";
import { databaseName } from "../constant.js";
// Source - https://stackoverflow.com/a/79892633
// Posted by Xoosk
// Retrieved 2026-02-27, License - CC BY-SA 4.0

import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${databaseName}`)
        
        console.log(`connected to ${connectionInstance.connection.host} successfully`)
    } catch (error) {
        console.log(error,"unable to connect to mongoDB")
        process.exit(1)
    }
}
export {connectDB}