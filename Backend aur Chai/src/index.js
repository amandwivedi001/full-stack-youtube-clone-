// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { createApp } from "./app.js";
import { connectRedis } from "./db/redis.js";
dotenv.config({
    path: './.env'
})



connectDB()
    .then(async () => {
        await connectRedis();
        
        const app = createApp();

        app.on("error", (error) => {
            console.log("ERROR :", error);
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`App listning on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`MongoDB failed error !!!! ${err}`);
    })
/*

import mongoose from "mongoose"
import { DB_NAME } from "./constants";

import express from "express"
const app = express()

    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

            app.on("error", (error) => {
                console.log("ERROR :", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port 
            ${process.env.PORT}`);
            })
        } catch (error) {
            console.error("Error :", error)
            throw error
        }
    })(); //here we use iff type of function to excute directly in js 

    */