//how our sever starts
import dotenv from "dotenv";
import app from "./app.js";
import express from "express";
import connectDB from "./config/database.js";

dotenv.config({
    path: './.env'
});


const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        app.listen(process.env.PORT || 8000, () =>{
            console.log(`SEVER RUNNIN IN PORT :
                ${process.env.PORT}`);

        }) //PORT IS LIKE ASA NGA PORT SPECIED IN THE .ENV FOLDER
    } catch (error) {
        console.log("Connection failed/error", error);
        
    }
}

startServer();