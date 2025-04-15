"use client"
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import { signUpSchema } from '@/schema/signUpSchema'
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from "lucide-react"


export default function SignupPage() {
    const [username, setUsername] = useState<string>("")
    const [usernameMsg, setUsernameMsg] = useState<string>("")
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const debounce = useDebounceCallback(setUsername, 500)
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMsg("")
                try {
                    const response = await axios.get(`/api/users/check-unique-username?username=${username}`)
                    setUsernameMsg(response.data.message)
                }
                catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMsg(axiosError.response?.data.message || "Error checking username")
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
            else {
                setUsernameMsg("")
            }
        }
        checkUsernameUniqueness()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        console.log(data) // Check console
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>("/api/users/sign-up", data)
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message || "Error submitting, try again later !"
            toast.error(errorMessage)
        }
        finally {
            setIsSubmitting(false)
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
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username..."
                                            {...field}
                                            onChange={e => {
                                                field.onChange(e)
                                                debounce(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && username.length? <Loader2 className='animate-spin' /> : 
                                    <p className={`${usernameMsg == "Username is unique"? "text-green-500" : "text-red-500"}`}>
                                        {usernameMsg}
                                    </p>
                                    }
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email..." {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                isSubmitting? 
                                <>
                                    <Loader2 className='animate-spin mr-4 h-4 w-4' /> Please wait
                                </> :
                                "Sign up"
                            }
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/signin" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}