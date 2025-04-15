import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";


export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingVerifiedUserByUsername = await User.findOne({username, isVerified: true})
        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                    success: false,
                    message: "User is already registered & verified"
                },
                { status: 401 }
            )
        }
        const existingUserByEmail = await User.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        let newUser;

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: true,
                        message: "User is already registered"
                    },
                    { status: 200 }
                )
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const verifyCodeExpiry = Date.now() + 60*60*1000
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const verifyCodeExpiry = Date.now() + 60*60*1000

            newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                messages: [],
                isVerified: false
            })
        }
        const sendEmail = await sendVerificationEmail(username, email, verifyCode)
        if(!sendEmail.success){
            return Response.json(
                {
                    success: false,
                    message: sendEmail.message,
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
                user: newUser
            },
            { status: 201 }
        )      
    }
    catch {
        return Response.json(
            {
                success: true,
                message: "Error registration user"
            },
            { status: 500 }
        )
    }
}