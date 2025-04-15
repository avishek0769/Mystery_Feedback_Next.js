import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: NextRequest) {
    await dbConnect()
    const session = await auth()
    const segments = request.nextUrl.pathname.split('/');
    const messageId = segments[segments.length - 1];

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const deletedMsg = await User.findByIdAndUpdate(
            session?.user._id,
            { $pull: { messages: { _id: messageId } } }
        )
        if (!deletedMsg?.isModified) {
            return NextResponse.json(
                { message: "ERROR: Message not deleted", success: false },
                { status: 403 }
            )
        }
        return NextResponse.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    }
    catch (error) {
        console.error('ERROR deleting message:', error);
        return NextResponse.json(
            { message: error.message, success: false },
            { status: 500 }
        );
    }
}