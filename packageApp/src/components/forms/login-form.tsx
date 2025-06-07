"use client";
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
import Link from "next/link";
import React, {useState} from "react";

import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import InputPassword from "@/components/custom/input-password";
import GithubSignInBtn from "@/components/forms/github-sign-in-btn";

export function LoginForm({className, ...props}: React.ComponentPropsWithoutRef<"div">) {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)}
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}

    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            setError("")

            const result = await signIn("credentials", {email, password, redirect: false})

            if(result?.ok){
                await router.push("/")
            }
            else {
                setError("invalid email or password")
            }
        } catch (err) {
            console.error(err)
            setError("something is wrong with a server")
        }
        finally {
            setIsLoading(false)
        }

    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="m@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <InputPassword passwordValue={password} handlePasswordChangeValue={handlePasswordChange}/>
                            </div>
                            {
                                error && <p className={"text-red-700 text-xs"}>{error}</p>
                            }
                            <Button
                                className="w-full"
                                onClick={handleSignIn}
                                disabled={isLoading}
                            >
                                Login
                            </Button>
                            <GithubSignInBtn/>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href={"/auth/signup"}
                                className={"hover:underline"}
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
