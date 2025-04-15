import mongoose from "mongoose"

type ConnectionType = {
    isConnected?: number
}

const connection: ConnectionType = {}

export async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to DB")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected")
    }
    catch (error) {
        console.log("DB Connection failed", error)
        process.exit(1)
    }
}
