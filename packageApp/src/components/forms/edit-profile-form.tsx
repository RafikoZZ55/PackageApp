"use client"
import React, { useEffect, useState } from 'react';
import { User, Lock, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {signOut, useSession} from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InputPassword from "@/components/custom/input-password";
import {ErrorData} from "@/types/interface";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useRouter} from "next/navigation";
import DisplayAvatars from "@/components/custom/display-avatars";

const EditProfileForm = () => {
    const { data: session} = useSession();


    const [avatar, setAvatar] = useState<string | undefined>("");
    const [name, setName] = useState<string | undefined>("");
    const [email, setEmail] = useState<string | undefined>("");
    const [userPassword, setUserPassword] = useState<string | undefined>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmedPassword, setConfirmedPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [error, setError] = useState<ErrorData | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {setName(e.target.value);};
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value);};
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {setNewPassword(e.target.value)}
    const handleConfirmedPassword = (e: React.ChangeEvent<HTMLInputElement>) => {setConfirmedPassword(e.target.value)}
    const handleUserPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {setUserPassword(e.target.value)}

    useEffect(() => {
        if (session?.user) {
            setAvatar(session.user.avatar);
            setName(session.user.name);
            setEmail(session.user.email);
        }
    }, [session]);

    const handleResetData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(session?.user){
            setName(session.user.name);
            setEmail(session.user.email)
            setAvatar(session.user.avatar);
            setNewPassword("")
            setConfirmedPassword("")
            setUserPassword("")
            setIsResetPassword(false)
            setError(null)
        }
    }

    const handleCheckInputsData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError(null)

        if (!session?.user) {
            setError({type: "error", message: "You need to log in!"});
            return;
        }

        if (!name || name.length < 3) {
            setError({ type: "name", message: "Name must be at least 3 characters long" })
            return;
        }

        if (isCredentialsUser && (!email || !email.includes("@"))) {
            setError({ type: "email", message: "Invalid email address" })
            return;
        }

        if (!avatar) {
            setError({ type: "avatar", message: "You need to select an avatar" })
            return;
        }

        if (isResetPassword) {
            if (!newPassword || newPassword.length < 8) {
                setError({ type: "password", message: "New password must be at least 8 characters long" })
                return;
            }
            if (newPassword !== confirmedPassword) {
                setError({ type: "confirmedPassword", message: "Passwords do not match" })
                return;
            }
        }

        if (!isCredentialsUser) {
            handleUpdateUserData(e);
        } else {
            setDialogOpen(true);
        }

    }

    const handleIsResetPasswordChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsResetPassword(!isResetPassword)
        if(!isResetPassword) {
            setNewPassword("")
            setConfirmedPassword("")
        }
        setError(null)
    }

    const handleUpdateUserData = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError(null)


        if (isCredentialsUser && !userPassword) {
            setError({type: "error", message: "Please enter your current password"})
            return;
        }

        try {
            setIsLoading(true)
            const oldEmail = session?.user.email
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email: isCredentialsUser ? email : session?.user.email,
                    newPassword,
                    avatar,
                    isResetPassword,
                    userPassword: isCredentialsUser ? userPassword : undefined,
                    oldEmail
                })
            })

            const responseData = await res.json();

            if (res.ok) {
                if (isCredentialsUser) {
                    setDialogOpen(false);
                    await signOut();
                    router.push("/");
                } else {
                    setError({type: "success", message: "Profile updated successfully!"});
                    window.location.reload();
                }
                return;
            } else {
                setError(responseData);
            }
        }
        catch (error) {
            console.error(error);
            setError({type: "error", message: "Error occurred"})
        }
        finally {
            setIsLoading(false);
        }
    }

    const isCredentialsUser = session?.user?.provider === "credentials";

    return (
        <div className="p-8 w-screen h-full flex flex-col justify-center items-center overflow-y-auto">
            <div className="max-w-2xl space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Edit Account</h2>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Profile Picture
                        </CardTitle>
                        <CardDescription>
                            Choose your avatar from the options below
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center gap-5">
                            <div className="flex w-full flex-row gap-5 items-center ">
                                <Avatar className="w-14 h-14 border-2">
                                    {avatar ? (
                                        <AvatarImage src={avatar} alt={session?.user?.name || "avatar"} />
                                    ) : (
                                        <AvatarFallback>{session?.user?.name?.[0] || "?"}</AvatarFallback>
                                    )}
                                </Avatar>
                                <div className={"h-full flex flex-col"}>
                                    <p className="font-medium">Current Avatar</p>
                                    <p className="text-sm text-muted-foreground">Selected avatar</p>
                                </div>
                            </div>
                            <DisplayAvatars setAvatar={setAvatar} avatar={avatar} />
                        </div>


                        {error?.type === "avatar" && (
                            <p className="text-red-700 text-xs">{error.message}</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={name || ""}
                                onChange={handleNameChange}
                                placeholder="Enter your full name"
                            />
                            {error?.type === "name" && (
                                <p className="text-red-700 text-xs">{error.message}</p>
                            )}
                        </div>

                        {isCredentialsUser && (
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    value={email || ""}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email address"
                                />
                                {error?.type === "email" && (
                                    <p className="text-red-700 text-xs">{error.message}</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>


                {isCredentialsUser && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5"/>
                            Security
                        </CardTitle>
                        <CardDescription>
                            Manage your password and security settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-muted-foreground">Change your password here</p>
                            </div>
                            <Button variant="outline" onClick={handleIsResetPasswordChange}>
                                {isResetPassword ? "Cancel Change" : "Change Password"}
                            </Button>
                        </div>

                        {isResetPassword && (
                            <div className="flex flex-col gap-5">
                                <div className="space-y-2">
                                    <Label>Enter new password</Label>
                                    <InputPassword
                                        passwordValue={newPassword}
                                        handlePasswordChangeValue={handleNewPasswordChange}
                                    />
                                    {error?.type === "password" && (
                                        <p className="text-red-700 text-xs">{error.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm new password</Label>
                                    <Input
                                        type="password"
                                        value={confirmedPassword}
                                        onChange={handleConfirmedPassword}
                                    />
                                    {error?.type === "confirmedPassword" && (
                                        <p className="text-red-700 text-xs">{error.message}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                    )}

                <div className="flex gap-3">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="flex-1"
                                onClick={handleCheckInputsData}
                            >
                                Save Changes
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Changes</DialogTitle>
                                <DialogDescription>
                                    Before saving changes you need to confirm your identity by entering your current
                                    password
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-4">
                                    <Label className="text-start w-full">
                                        Current Password
                                    </Label>
                                    <InputPassword
                                        passwordValue={userPassword || ""}
                                        handlePasswordChangeValue={handleUserPasswordChange}
                                    />
                                    {error?.type === "error" && (
                                        <p className="text-red-700 text-xs">{error.message}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleUpdateUserData}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={handleResetData}>
                        Reset
                    </Button>
                </div>

                {error?.type === "success" && (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfileForm;