import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AccessDenied = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-background to-muted/20">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Authentication Required
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Please log in to access this page
                    </p>
                </div>

                <Card className="border-2 shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Access Restricted</CardTitle>
                        <CardDescription>
                            This page requires authentication to view its content
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/auth/login" className="block">
                            <Button className="w-full h-12 text-base group" size="lg">
                                Log In to Continue
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Do not have an account?{" "}
                                <Link
                                    href="/auth/signup"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;