"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from "lucide-react"
import { signInSchema } from '@/schema/signInSchema'
import { signIn } from 'next-auth/react'
// import { signIn } from '@/auth'


export default function SignupPage() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if(result?.error){
            setIsSubmitting(false)
            toast.error(result.error)
        }
        console.log(result.url)
        if(result?.url?.length){
            router.replace("https://z1v3k1h4-3000.inc1.devtunnels.ms/dashboard")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <Toaster />

            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field  }) => (
                                <FormItem>
                                    <FormLabel>Username / Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username / email..." {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your password..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {
                                isSubmitting ?
                                <>
                                    <Loader2 className='animate-spin mr-4 h-4 w-4' /> Please wait
                                </> :
                                "Sign In"
                            }
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Dont not have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}