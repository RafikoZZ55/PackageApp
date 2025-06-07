"use client";

import React  from "react";
import {Search, BookmarkIcon, HomeIcon} from "lucide-react";
import {navbarButton} from "@/types/interface";
import { Sidebar } from "@/components/ui/sidebar";
import NavbarHeader from "@/components/nav-bar/navbar-header";

import NavbarContent from "@/components/nav-bar/navbar-content";
import NavbarFooter from "@/components/nav-bar/navbar-footer";



const NavbarMain = () => {

    const navbarButtons: navbarButton[] = [
        {name: "Home", icon: <HomeIcon className="w-5 h-5" />, link: "/"},
        { name: "Search", icon: <Search className="w-5 h-5" />, link: "/search" },
        { name: "Saves", icon: <BookmarkIcon className="w-5 h-5" />, link: "/saves" },
    ];


    return (
        <Sidebar className="border-r">

            <NavbarHeader/>
            <NavbarContent navbarButtons={navbarButtons} />
            <NavbarFooter/>
        </Sidebar>
    );
};

export default NavbarMain;