import React from 'react';
import {Slack} from "lucide-react";
import {SidebarHeader} from "@/components/ui/sidebar";
import Link from "next/link";

const NavbarHeader = () => {
    return (
        <SidebarHeader className="border-b px-6  h-20 flex flex-col justify-center ">
            <div className="flex items-center gap-3">
                <Link href={"/"} className="bg-primary p-2 rounded-lg text-primary-foreground flex flex-col justify-center items-center hover:rotate-45 transition-all duration-300">
                    <Slack className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Syncflow</h1>
                    <p className="text-xs text-muted-foreground">Productivity Suite</p>
                </div>
            </div>
        </SidebarHeader>
    );
};

export default NavbarHeader;