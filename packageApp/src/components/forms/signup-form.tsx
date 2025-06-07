"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import React, { useState } from "react"
import { ErrorData } from "@/types/interface"
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import InputPassword from "@/components/custom/input-password";
import DisplayAvatars from "@/components/custom/display-avatars";
import GithubSignInBtn from "@/components/forms/github-sign-in-btn";


export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmedPassword, setConfirmedPassword] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<ErrorData | null>(null)
    const router = useRouter()

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
    const handleConfirmedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmedPassword(e.target.value)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)


        if (name.length < 3) {
            setError({ type: "name", message: "Name must be at least 3 characters long" })
            return
        }
        if (!email.includes("@")) {
            setError({ type: "email", message: "Invalid email address" })
            return
        }
        if (password.length < 8) {
            setError({ type: "password", message: "Password must be at least 8 characters long" })
            return
        }
        if (password !== confirmedPassword) {
            setError({ type: "confirmedPassword", message: "Passwords do not match" })
            return
        }
        if (!avatar) {
            setError({ type: "avatar", message: "You need to select an avatar" })
            return
        }
        setIsLoading(true)
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ name, email, password, confirmedPassword, image: avatar })
            })

            const data: ErrorData = await response.json()

            if (data.type === "success") {
                setError({ type: "success", message: data.message })
                setName("")
                setEmail("")
                setPassword("")
                setConfirmedPassword("")
                setAvatar("")
                await router.push("/auth/login")
            } else {
                setError(data)
            }

        } catch (err) {
            console.error(err)
            setError({ type: "error", message: "Network error occurred" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Signup</CardTitle>
                    <CardDescription>Fill the fields to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="name"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                                {error?.type === "name" && <p className="text-red-700 text-xs">{error.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                {error?.type === "email" && <p className="text-red-700 text-xs">{error.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <InputPassword passwordValue={password} handlePasswordChangeValue={handlePasswordChange}/>
                                {error?.type === "password" && <p className="text-red-700 text-xs">{error.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirmedPassword">Confirmed Password</Label>
                                <Input
                                    id="confirmedPassword"
                                    type="password"
                                    value={confirmedPassword}
                                    onChange={handleConfirmedPasswordChange}
                                />
                                {error?.type === "confirmedPassword" && (
                                    <p className="text-red-700 text-xs">{error.message}</p>
                                )}
                            </div>

                            <Label>Avatar</Label>
                            {error?.type === "avatar" && <p className="text-red-700 text-xs">{error.message}</p>}
                            <DisplayAvatars setAvatar={setAvatar} avatar={avatar}/>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Sign up"}
                            </Button>
                            <GithubSignInBtn/>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Already have an account? <Link href="/auth/login">Log in</Link>
                        </div>
                    </form>
                </CardContent>
                {error?.type === "error" && <p className="text-red-700 text-xs p-4">{error.message}</p>}
            </Card>
        </div>
    )
}