import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET() {
    await dbConnect()

    const session = await auth()
    const _user = session?.user

    if(!session || !_user){
        return NextResponse.json(
            { message: 'User is not authenticated', success: false },
            { status: 410 }
        );
    }
    try {
        const user = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(_user._id) }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: { "messages.createdAt": -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ])
        
        if(!user || user.length == 0){
            return NextResponse.json(
                { message: 'Error Fetching messages', success: false },
                { status: 402 }
            )
        }
        return NextResponse.json(
            { message: 'Fetched messages', success: true, messages: user[0].messages },
            { status: 200 }
        )
    }
    catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );    
    }
}