import {ReactNode} from "react";

export interface ErrorData {
    type: "name" | "email" | "password" | "error"|"avatar" | "confirmedPassword" |"success";
    message: string;
}

export interface CreateUserData {
    id?: number;
    name: string;
    email: string;
    password: string;
    image: string; // <-- change from avatar to image
    updatedAt: Date;
    createdAt: Date;
}

export interface navbarButton {
    name: string;
    icon: ReactNode;
    link: string;
}