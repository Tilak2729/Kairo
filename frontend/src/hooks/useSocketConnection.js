import { useEffect, useState } from "react";

import {
    initializeSocket,
    receiveMessage,
    disconnectSocket,
} from "../config/socket";

const useSocketConnection = ({
    project,
    setMessages,
    setFileTree,
    setCurrentFile,
    isRemoteUpdate,
}) => {

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {

        if (!project) return;

        initializeSocket(project._id);

        receiveMessage("project-message", (data) => {

            setMessages(prev => {

                const last = prev[prev.length - 1];

                if (
                    last &&
                    last.sender._id === data.sender._id &&
                    last.message === data.message
                ) {
                    return prev;
                }

                return [...prev, data];

            });

            if (data.fileTree) {

                setFileTree(data.fileTree);

                const firstFile = Object.keys(data.fileTree)[0];

                if (firstFile) {
                    setCurrentFile(firstFile);
                }

            }

        });

        receiveMessage("file-update", (data) => {

            isRemoteUpdate.current = true;

            setFileTree(data.fileTree);

        });

        receiveMessage("online-users", (users) => {

            setOnlineUsers(users);

        });

        return () => {

            disconnectSocket();

        };

    }, [project]);

    return {

        onlineUsers,

    };

};

export default useSocketConnection;