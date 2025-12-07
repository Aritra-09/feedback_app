
import mongoose from "mongoose";

type ConnenctionObject = {
    isConnected?: number;
}

const connection: ConnenctionObject = {

}

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log('Database is alrady connected');
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}${process.env.MONGODB_DB}`);
        // console.log(db);
        // console.log(db.connections);
        

        connection.isConnected = db.connections[0].readyState;

        console.log('DB connected successfully');
       

    } catch (error) {
        console.log('Error connecting to database:', error);
        process.exit(1)
    }
}

export default dbConnect;