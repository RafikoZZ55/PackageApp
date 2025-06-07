"use client";

import React  from "react";
import { CheckSquare, Calendar, MapPin } from "lucide-react";
import {navbarButton} from "@/types/interface";
import { Sidebar } from "@/components/ui/sidebar";
import NavbarHeader from "@/components/nav-bar/navbar-header";

import NavbarContent from "@/components/nav-bar/navbar-content";
import NavbarFooter from "@/components/nav-bar/navbar-footer";



const NavbarMain = () => {

    const navbarButtons: navbarButton[] = [
        { name: "Tasks", icon: <CheckSquare className="w-5 h-5" /> },
        { name: "Calendar", icon: <Calendar className="w-5 h-5" /> },
        { name: "Places", icon: <MapPin className="w-5 h-5" /> },
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