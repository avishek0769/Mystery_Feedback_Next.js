"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User } from "next-auth"
import { Button } from './ui/button'


export default function NavBar() {
    const { data: session } = useSession()
    const user: User = session?.user as User
    console.log(user)

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </a>
                {user ? (
                    <>
                        <span className="mr-4">
                            Welcome, {user.username || user.email}
                        </span>
                        <Button onClick={() => signOut({redirect: false})} className="w-full md:w-auto" variant='outline'>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button className="w-full md:w-auto" variant={'outline'}>
                        <Link href="/signin">Login </Link>
                    </Button>
                )}
            </div>
        </nav>
    )
}
