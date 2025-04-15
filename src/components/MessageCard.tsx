import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Message } from '@/model/user.model';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/types/ApiResponse';
import dayjs from "dayjs"

type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProp) {

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/message/delete/${message._id}`)
            toast.success("Message deleted")
            onMessageDelete(message._id as string);
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Failed to delete message')
        }
    }

    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className='leading-6'>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive'>
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(new Date(message.createdAt)).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
    )
}

