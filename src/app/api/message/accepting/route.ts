import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await dbConnect()
    const { isAcceptingMessages } = await request.json()
    const session = await auth()
    const _user = session?.user

    if(!session || !_user) {
        return NextResponse.json(
            { success: false, message: 'User is not authenticated' },
            { status: 402 }
        )
    }

    try {
        const user = await User.findByIdAndUpdate(
            _user._id,
            { isAcceptingMessages },
            { new: true }
        )
        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: 'Successfully updated message acceptance status',
                isAcceptingMessages: user?.isAcceptingMessages },
            { status: 200 }
        )
    }
    catch (error: unknown) {
        console.error('Error updating message acceptance status:', error);
        return NextResponse.json(
            { success: false, message: 'Error updating message acceptance status' },
            { status: 500 }
        );
    }
}


export async function GET() {
    await dbConnect()
    const session = await auth()
    const _user = session?.user

    if(!session || !_user) {
        return NextResponse.json(
            { success: false, message: 'User is not authenticated' },
            { status: 402 }
        )
    }
    try {
        const user = await User.findById(_user._id)
        if(!user){
            return NextResponse.json(
                { success: true, message: 'User not found' },
                { status: 403 }
            )
        }
        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: 'Fetched User message acceptance status',
                isAcceptingMessages: user.isAcceptingMessages
            },
            { status: 200 }
        )
    }
    catch (error: unknown) {
        console.error('Error getting message acceptance status:', error);
        return NextResponse.json(
            { success: false, message: 'Error getting message acceptance status' },
            { status: 500 }
        );
    }
}