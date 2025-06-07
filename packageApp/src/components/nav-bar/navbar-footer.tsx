"use client";
import React, {useEffect} from 'react';
import {SidebarFooter} from "@/components/ui/sidebar";
import {ModeToggle} from "@/components/modeToggle";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogOut, Settings} from "lucide-react";
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";


const NavbarFooter = () => {

    const { data: session, status } = useSession();


    useEffect(() => {
        console.log("=== SESSION DEBUG ===");
        console.log("Status:", status);
        console.log("Session:", JSON.stringify(session, null, 2));
        console.log("Loading:", status === "loading");
        console.log("Authenticated:", status === "authenticated");
        console.log("Unauthenticated:", status === "unauthenticated");
        console.log("====================");
    }, [session, status]);

    const handleSingOut = async ()  => {
        await signOut();
    }

    useEffect(() => {
        console.log("Session:", session);
        console.log("Status:", status);
    }, [session, status]);

    return (
        <SidebarFooter className="border-t px-4 py-4 space-y-2">

            <div className={"flex flex-row justify-start items-center gap-5"}>
                <ModeToggle/>
                <div>
                    <p>Toggle Theme</p>

                    <p className="text-xs text-muted-foreground hidden dark:block">
                        Dark mode
                    </p>

                    <p className="text-xs text-muted-foreground block dark:hidden">
                        Light mode
                    </p>
                </div>
            </div>

            <hr/>

            {status === "authenticated" ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 flex flex-row h-12"
                        >
                            <Avatar className="size-8">
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                <AvatarFallback>
                                    {session?.user?.name?.slice(0,2) || "??"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-full flex flex-col items-center justify-start text-start">
                                <p className=" text-sm leading-tight truncate w-full">
                                    {session?.user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate w-full mt-0.5">
                                    {session?.user?.email ?
                                        `${session.user.email.slice(0,20)}${session.user.email.length > 20 ? '...' : ''}`
                                        : ''
                                    }
                                </p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={"/settings"}>
                            <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSingOut}
                            className="text-destructive focus:text-destructive"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href={"/auth/login"} passHref>
                    <Button className="w-full">
                        Log in
                    </Button>
                </Link>
            )}
        </SidebarFooter>
    );
};

export default NavbarFooter;