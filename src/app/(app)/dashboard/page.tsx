"use client"
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/user.model'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { DOMAIN } from "@/lib/constants"

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([])
    const messagesFetched = useRef(null)
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session } = useSession()
    const { register, watch, setValue } = useForm()
    const acceptMessages = watch("acceptMessages")
    const profileUrl = `${DOMAIN}/u/${session?.user.username}`

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter(message => message._id != messageId))
    }

    const fetchIsAcceptingMessages = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const res = await axios.get<ApiResponse>("/api/message/accepting")
            setValue("acceptMessages", res.data.isAcceptingMessages)
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch is accepting messages")
        }
        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const res = await axios.get<ApiResponse>("/api/message/get")
            setMessages(res.data.messages || [])
            if (refresh) toast.success("Showing refreshed Messages");
            else toast.success("Fetched Messages");
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch messages")
        }
        finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setMessages, setIsLoading, setIsSwitchLoading])

    useEffect(() => {
        if (!session || !session.user) return;
        if(!messagesFetched.current){
            messagesFetched.current = true
            fetchMessages()
        }
        fetchIsAcceptingMessages()
    }, [session, fetchMessages, fetchIsAcceptingMessages, messagesFetched])

    const handleSwitchChange = async () => {
        setValue("acceptMessages", !acceptMessages)
        try {
            const res = await axios.post<ApiResponse>("/api/message/accepting", {
                isAcceptingMessages: !acceptMessages
            })
            console.log(res)
            toast.success("Toggled Successfully")
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to toggle")
            setValue("acceptMessages", !acceptMessages)
        }
    }

    const copyProfileUrl = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("URL copied")
    }

    if (!session || !session.user) {
        return <div>Please login</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
            <Toaster />
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <Input
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-3 mr-2"
                    />
                    <Button onClick={copyProfileUrl}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}
