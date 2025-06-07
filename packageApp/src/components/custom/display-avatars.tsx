import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";


interface DisplayAvatarsProps {
    setAvatar: (avatar: string) => void;
    avatar: string | undefined;
}

const DisplayAvatars: React.FC<DisplayAvatarsProps> = ({ setAvatar, avatar} ) => {


    const avatars: string[] = [];
    for (let i = 1; i < 15; i++) {
        avatars.push(`/avatars/avatar-${i}.svg`);
    }

    return (
        <div className=" flex flex-wrap items-center justify-center gap-5 p-4 bg-muted/30 rounded-lg">
            {avatars.map((e, index) => (
                <button
                    type={"button"}
                    key={index}
                    className={`rounded-full border-2 focus:outline-none transition-colors hover:border-primary/50 ${
                        avatar === e ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setAvatar(e)}
                    aria-label={`Select avatar ${index + 1}`}
                >
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={e} alt={`Avatar ${index + 1}`} />
                    </Avatar>
                </button>
            ))}
        </div>
    );
};

export default DisplayAvatars;