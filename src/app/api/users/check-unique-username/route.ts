import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import { usernameValidation } from "@/schema/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    try {
        const result = usernameQuerySchema.safeParse({
            username: searchParams.get("username")
        })
        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: usernameError.length > 0? usernameError.join(",") : "Invalid query parameters",
                },
                { status: 401 }
            );
        }

        const { username } = result.data
        const existingUser = await User.findOne({ username, isVerified: true })

        if(existingUser){
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 402 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );
    }
    catch (error: unknown) {
        console.error('Error checking username:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}