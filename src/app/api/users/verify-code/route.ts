import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    await dbConnect()
    const { username, code } = await request.json()
    console.log(username, code)
    try {
        const user = await User.findOne({ username })
        if(!user) {
            return NextResponse.json(
                { success: false, message: 'User does not exists' },
                { status: 401 }
            );
        }

        const isValidCode = user.verifyCode == code
        const isNotExpired = user.verifyCodeExpiry! > Date.now()
        
        if(isValidCode && isNotExpired) {
            user.isVerified = true;
            user.verifyCode = "0";
            user.verifyCodeExpiry = 0;
            await user.save()

            return NextResponse.json(
                { success: true, message: 'User is verified' },
                { status: 200 }
            );
        }
        else if(!isValidCode) {
            return NextResponse.json(
                { success: false, message: 'Code is incorrect' },
                { status: 401 }
            );
        }
        else {
            return NextResponse.json(
                { success: false, message: 'Code is expired' },
                { status: 402 }
            );
        }
    }
    catch (error: unknown) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
}