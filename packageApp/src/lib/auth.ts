import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,


    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },

    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log("Missing credentials");
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        console.log("User not found or no password");
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },

    callbacks: {
        async session({ session, user }) {
            if (user && session.user) {
                session.user.id = user.id;
            }
            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },

    debug: process.env.NODE_ENV === "development",

    events: {
        async signIn({ user, account}) {
            console.log("SignIn event:", { user: user.email, account: account?.provider });
        },
        async session({ session }) {
            console.log("Session event:", session.user?.email);
        },
    },
}