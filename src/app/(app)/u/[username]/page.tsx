'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { messageSchema } from "@/schema/messageSchema"
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import axios, { AxiosError } from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ApiResponse } from '@/types/ApiResponse';

type ProfilePageParams = {
    username: string;
}

export default function MessageSend() {
    const params = useParams<ProfilePageParams>()
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const handleSendMessage = async (data: {content: string; username: string}) => {
        try {
            await axios.post<ApiResponse>("/api/message/send", {
                message: data.content,
                username: params.username
            })
            toast.success("Message sent");
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse>
            if(axiosError.response?.status == 408) {
                toast.error("User is not accepting messages")
            }
        }
    }

    const loadTextarea = (e: React.MouseEvent<HTMLButtonElement>) => {
        form.setValue("content", (e.target as HTMLDivElement).innerText)
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
            <Toaster />
            <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Send annonymous message to @{params.username}</h2>{' '}
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSendMessage)} className='flex flex-col items-center gap-4'>
                            <FormField
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea {...field} className='w-[69rem] ' placeholder='Write your message....' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit'>Send Message</Button>
                        </form>
                    </Form>
                </div>
            </div>

            <div className='mt-10'>
                <Button>Suggest Messages</Button>
            </div>
            <p className='py-5'>Click on unknown message below to select it</p>

            <Card className='w-[65%] m-auto'>
                <CardContent>
                    <CardTitle className='mb-4 text-xl font-black'>Messages</CardTitle>
                    <div className='flex flex-col gap-5'>
                        <Button onClick={loadTextarea} variant="outline" className='text-center cursor-pointer'>
                            What is something or someone that always manages to brighten your day?
                        </Button>
                        <Button onClick={loadTextarea} variant="outline" className='text-center cursor-pointer'>
                            Tell us about a memorable travel experience you have had
                        </Button>
                        <Button onClick={loadTextarea} variant="outline" className='text-center cursor-pointer'>
                            If you could learn unknown skill instantly, what would it be?
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
