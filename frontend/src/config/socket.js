import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {

    if (socketInstance) {
        socketInstance.disconnect();
    }

    socketInstance = io(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem("token"),
        },
        query: {
            projectId,
        },
    });

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {

    socketInstance.off(eventName);

    socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
};

export const sendFileUpdate = (fileTree) => {

    console.log("Sending File Update");

    socketInstance.emit("file-update", {
        fileTree
    });

};

export const disconnectSocket = () => {

    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }

};