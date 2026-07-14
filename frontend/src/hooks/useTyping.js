import { useEffect, useRef, useState } from "react";
import { receiveMessage, sendMessage } from "../config/socket";

const useTyping = (project, user) => {

    const [typingUser, setTypingUser] = useState(null);

    const typingTimeout = useRef(null);
    const isTyping = useRef(false);

    useEffect(() => {

        if (!project) return;

        receiveMessage("typing-start", (data) => {

            if (data.userId !== user._id) {
                setTypingUser(data.email);
            }

        });

        receiveMessage("typing-stop", (data) => {

            if (data.userId !== user._id) {
                setTypingUser(null);
            }

        });

    }, [project, user]);

    const handleTyping = (value) => {

        if (!isTyping.current) {

            isTyping.current = true;

            sendMessage("typing-start", {
                userId: user._id,
                email: user.email,
            });

        }

        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {

            isTyping.current = false;

            sendMessage("typing-stop", {
                userId: user._id,
            });

        }, 1000);

    };

    return {

        typingUser,
        handleTyping,

    };

};

export default useTyping;