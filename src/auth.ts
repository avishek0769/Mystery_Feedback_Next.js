import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";


export const NextAuthOptions: NextAuthConfig = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Identifier", placeholder: "Enter your identifier", type: "text" },
                password: { label: "Password", placeholder: "Enter your password", type: "text" },
            },
            authorize: async (credentials) => {
                await dbConnect()
                try {
                    const user = await User.findOne({
                        $or: [
                            { username: credentials.identifier },
                            { email: credentials.identifier }
                        ]
                    });
                    if (!user) {
                        throw new Error("User doesn't exists")
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified")
                    }
                    const isPasswordValid = await bcrypt.compare(credentials?.password as string, user.password)
                    if (!isPasswordValid) {
                        throw new Error("Password is wrong")
                    }
                    return {
                        _id: user?._id?.toString(),
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessages,
                    }
                }
                catch (error) {
                    throw new Error(error.message)
                }
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token._id = user._id?.toString()
                token.username = user.username
                token.email = user.email
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString()
                session.user.username = token.username as string
                session.user.email = token.email as string
                session.user.isVerified = token.isVerified as boolean
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
            }
            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.AUTH_SECRECT,
    trustHost: true, // CHECK
}

export const { auth, signIn, signOut, handlers } = NextAuth(NextAuthOptions)
