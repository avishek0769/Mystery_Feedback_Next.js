import { dbConnect } from "@/lib/dbConnect";
import User, { Message } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await dbConnect()
    const { message, username } = await request.json()

    try {
        const user = await User.findOne({ username })
        if(!user){
            return NextResponse.json(
                { message: 'User does not exists with this username', success: false },
                { status: 407 }
            );
        }
        if(!user.isAcceptingMessages){
            return NextResponse.json(
                { message: 'User is not accepting messages', success: false },
                { status: 408 }
            );
        }

        user.messages.push({ content: message, createdAt: Date.now() } as Message)
        await user.save()

        return NextResponse.json(
            { message: 'Message is sent', success: true },
            { status: 200 }
        );
    }
    catch (error: unknown) {
        console.error('Error adding message:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}