import React from 'react';
import {SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {navbarButton} from "@/types/interface";
import Link from "next/link";

const NavbarContent = ({navbarButtons}: {navbarButtons: navbarButton[]}) => {
    return (
        <SidebarContent className="px-4 py-4">
            <SidebarMenu>
                {navbarButtons.map((e: navbarButton, index: number) => (
                    <Link href={e.link} key={index}>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="w-full justify-start gap-3 px-3 py-2 h-10"
                            >
                                {e.icon}
                                <span>{e.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </Link>
                ))}
            </SidebarMenu>
        </SidebarContent>
    );
};

export default NavbarContent;