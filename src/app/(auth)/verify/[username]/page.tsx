"use client"
import { verifySchema } from '@/schema/verifySchema'
import { useParams } from 'next/navigation'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function VerifyPage() {
    const router = useRouter()
    const { username } = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    async function onSubmit(data: z.infer<typeof verifySchema>) {
        console.log(data)
        try {
            const response = await axios.post("/api/users/verify-code", {
                username, code: data.code
            })
            toast.success(response.data.message)
            router.replace("/signin")
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message || "Error submitting, try again later !"
            toast.error(errorMessage)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Toaster />
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}