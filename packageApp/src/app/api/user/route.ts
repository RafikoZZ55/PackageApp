import { NextRequest, NextResponse } from "next/server";
import { CreateUserData, ErrorData } from "@/types/interface";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: CreateUserData = await req.json();
        const { name, email, password, image }: { name: string, email: string, password: string, image: string } = body;

        if (!name || name.length < 3) {
            const res: ErrorData = { type: "name", message: "Name must be at least 3 characters long" };
            return NextResponse.json(res, { status: 400 });
        }

        if (!email || !email.includes("@")) {
            const res: ErrorData = { type: "email", message: "Invalid email address" };
            return NextResponse.json(res, { status: 400 });
        }

        if (!password || password.length < 8) {
            const res: ErrorData = { type: "password", message: "Password must be at least 8 characters long" };
            return NextResponse.json(res, { status: 400 });
        }

        if (!image) {
            const res: ErrorData = { type: "image", message: "You need to select an image" };
            return NextResponse.json(res, { status: 400 });
        }

        const isEmailInUse = await prisma.user.findUnique({ where: { email } });
        if (isEmailInUse) {
            const res: ErrorData = { type: "email", message: "Email is already in use" };
            return NextResponse.json(res, { status: 409 });
        }

        const hashedPassword: string = await bcrypt.hash(password, 12);

        const createUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image
            }
        });

        if (!createUser) {
            const res: ErrorData = { type: "error", message: "Failed to create user" };
            return NextResponse.json(res, { status: 500 });
        }



        const successResponse: ErrorData = { type: "success", message: "User created successfully!" };
        return NextResponse.json(successResponse, { status: 201 });


    } catch (err) {
        console.error("Error creating user:", err);
        const res: ErrorData = { type: "error", message: "Server error occurred" };
        return NextResponse.json(res, { status: 500 });
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        const { name, email, newPassword, avatar, isResetPassword, userPassword, oldEmail } = body;


        const user: User | null = await prisma.user.findUnique({
            where: { email: oldEmail }
        });

        if (!user) {
            const res: ErrorData = { type: "error", message: "User not found" };
            return NextResponse.json(res, { status: 404 });
        }


        if (user.password) {
            const isPasswordCorrect = await bcrypt.compare(userPassword, user.password);
            if (!isPasswordCorrect) {
                const res: ErrorData = { type: "error", message: "Invalid current password" };
                return NextResponse.json(res, { status: 401 });
            }
        }


        if (!name || name.length < 3) {
            const res: ErrorData = { type: "name", message: "Name must be at least 3 characters long" };
            return NextResponse.json(res, { status: 400 });
        }

        if (!email || !email.includes("@")) {
            const res: ErrorData = { type: "email", message: "Invalid email address" };
            return NextResponse.json(res, { status: 400 });
        }

        if (!avatar || avatar.length <= 0) {
            const res: ErrorData = { type: "avatar", message: "You need to select an avatar" };
            return NextResponse.json(res, { status: 400 });
        }


        if (email !== oldEmail) {
            const isEmailInUse = await prisma.user.findUnique({
                where: { email: email }
            });
            if (isEmailInUse) {
                const res: ErrorData = { type: "email", message: "Email is already in use" };
                return NextResponse.json(res, { status: 409 });
            }
        }


        if (isResetPassword) {
            if (!newPassword || newPassword.length < 8) {
                const res: ErrorData = { type: "password", message: "New password must be at least 8 characters long" };
                return NextResponse.json(res, { status: 400 });
            }
        }


        const updateData: {name: string, email: string, image: string, password? : string} = {
            name: name,
            email: email,
            image: avatar,
        };


        if (isResetPassword && newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 12);
        }


        const updatedUser = await prisma.user.update({
            data: updateData,
            where: {
                email: oldEmail
            }
        });

        if (!updatedUser) {
            const res: ErrorData = { type: "error", message: "Failed to update user" };
            return NextResponse.json(res, { status: 500 });
        }

        const res: ErrorData = { type: "success", message: "Account updated successfully" };
        return NextResponse.json(res, { status: 200 });

    } catch (error) {
        console.error("Error updating user:", error);
        const res: ErrorData = { type: "error", message: "Something went wrong in our backend" };
        return NextResponse.json(res, { status: 500 });
    }
}