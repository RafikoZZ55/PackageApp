import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";

const InputPassword = ({
                           passwordValue,
                           handlePasswordChangeValue,
                       }: {
    passwordValue: string | undefined;
    handlePasswordChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const [isPasswordVisable, setIsPasswordVisable] = useState<boolean>(false);

    return (
        <div className={"flex w-full flex-row gap-2"}>
            <Input
                className={"w-full"}
                id="password"
                type={isPasswordVisable ? "text" : "password"}
                value={passwordValue}
                onChange={handlePasswordChangeValue}
            />
            <Button type={"button"} onClick={() => setIsPasswordVisable(!isPasswordVisable)}>
                {isPasswordVisable ? <Eye /> : <EyeClosed />}
            </Button>
        </div>
    );
};

export default InputPassword;
