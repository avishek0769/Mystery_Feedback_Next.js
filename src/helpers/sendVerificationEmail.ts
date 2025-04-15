import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '../types/ApiResponse'

export async function sendVerificationEmail (username: string, email: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            subject: "Mystery Feedback | Verification code",
            to: email,
            react: VerificationEmail({username, otp: verifyCode})
        })
        
        return {success: true, message: "Email sent successfully !"}
    }
    catch (error) {
        console.log("Error sending email", error)
        return {success: true, message: "Error sending email"}
    }
}