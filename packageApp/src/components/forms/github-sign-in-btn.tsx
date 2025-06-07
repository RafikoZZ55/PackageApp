import React from 'react';
import {signIn} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const GithubSignInBtn = () => {
    const router = useRouter();

    const handleGitHubSignIn = async () => {
        await signIn("github");
        router.push("/");

    }

    return (
        <Button variant="outline" className="w-full" type="button" onClick={handleGitHubSignIn} >
            Sign up with Github
        </Button>
    );
};

export default GithubSignInBtn;