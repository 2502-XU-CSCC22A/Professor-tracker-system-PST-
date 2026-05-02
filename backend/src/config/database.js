import mongoose from "mongoose"; //which talks to the data base ni
//connects backend to the db

const connectDB = async () => { //async we want in js some task to finish and only he next task begin
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URI}`) //WE WILL BE USING  .ENV AND MONGODB URI
        console.log(`\n MongoDB test
            ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongodb error", error);
        process.exit(1)
        
    }
}

export default connectDB;