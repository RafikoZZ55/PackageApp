"use client"
import React from 'react';
import {Bell, Menu, Palette, PencilRuler, Shield, Trash2, X} from "lucide-react";
import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import EditProfileForm from "@/components/forms/edit-profile-form";
import AccessDenied from "@/components/custom/acces-denied";
import {useSession} from "next-auth/react";

interface sideBarButton {
icon : React.ReactNode, name: string, id: string, description: string
}

const Page = () => {
    const {status} = useSession();
    const [isClosed, setIsClosed] = React.useState(false);


    const navbarButtons: sideBarButton[] = [
        {
            icon: <PencilRuler className="w-6  h-6" />,
            name: "Edit Account",
            id: "edit-account",
            description: "Update your profile information"
        },
        {
            icon: <Shield className="w-6  h-6" />,
            name: "Privacy & Security",
            id: "privacy",
            description: "Manage your privacy settings"
        },
        {
            icon: <Bell className="w-6  h-6" />,
            name: "Notifications",
            id: "notifications",
            description: "Configure notification preferences",
        },
        {
            icon: <Palette className="w-6  h-6" />,
            name: "Appearance",
            id: "appearance",
            description: "Customize your theme"
        },
        {
            icon: <Trash2 className="w-6  h-6 text-red-700" />,
            name: "Delete Account",
            id: "delete",
            description: "Permanently delete your account",
        }
    ];

    return (
        <div className={"w-full h-screen overflow-x-hidden"}>
            <div className={" bg-sidebar border-r flex flex-col gap-2 list-none w-screen h-fit md:fixed md:w-64 md:h-screen z-40"}>

                <div className={"border-b h-20 flex flex-row md:flex-col md:items-start items-center md:justify-center gap-5 px-4"}>

                    {
                        isClosed ? (
                            <Menu className={" md:hidden block h-8 w-8"} onClick={() => setIsClosed(!isClosed)}/>
                        ) : (
                        <X className={" md:hidden block h-8 w-8"} onClick={() => setIsClosed(!isClosed)}/>
                        )
                    }
                    <div>
                        <h1 className="text-xl font-bold pb-0.5">Settings</h1>
                        <p className="text-xs text-muted-foreground">Edit your profile</p>
                    </div>
                </div>



                <div className={`px-4 gap-1 py-2 flex flex-col ${isClosed ? "hidden" : "block"} `}>
                    {navbarButtons.map((e: sideBarButton, index: number) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton
                                className="w-full justify-start gap-3 px-3 py-2 h-fit "
                            >
                                <div className={`h-full items-center flex justify-center`}>
                                    {e.icon}
                                </div>

                                <div className={"flex flex-col justify-center"}>
                                    <span className={`${e.id == "delete" && "text-red-700 font-bold"}`}>{e.name}</span>
                                    <p className={`text-xs text-muted-foreground `}>{e.description}</p>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </div>

            </div>

            <div>
                {status == "unauthenticated" ? (
                    <AccessDenied/>
                ) : (
                    <div className={"w-full m-0 md:pl-64 flex justify-center items-center"}>
                        <EditProfileForm/>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Page;