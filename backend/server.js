import "dotenv/config";
import http from 'http';
import app from './app.js';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import projectModel from './models/project.model.js'
import { generateResult, selectRelevantFiles, cleanAIResponse} from "./services/ai.service.js";
import userModel from "./models/user.model.js";


const port = process.env.PORT || 3000;
const server = http.createServer(app);
const onlineUsers = new Map();
function normalizeWhitespace(text) {

    return text
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, " ")
        .trim();

}
const io = new Server(server, {cors:{
    origin: '*'
}});

io.use(async (socket, next)=>{
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        const projectId = socket.handshake.query.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error('invalid projectId'))
        }

        socket.project = await projectModel.findById(projectId);

        if(!token){
            return next(new Error('Authentication Error'))
        }
const decoded = jwt.verify(token, process.env.JWT_SECRET);

if (!decoded) {
    return next(new Error("Authentication Error"));
}

const user = await userModel.findOne({
    email: decoded.email,
});

if (!user) {
    return next(new Error("User not found"));
}

socket.user = user;

next();


    } catch(err){
        next(err)
    }
})

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    socket.join(socket.roomId);
    onlineUsers.set(socket.user._id, {
    socketId: socket.id,
    roomId: socket.roomId,
});

io.to(socket.roomId).emit("online-users", [
    ...onlineUsers.entries()
        .filter(([_, user]) => user.roomId === socket.roomId)
        .map(([userId]) => userId)
]);

socket.on("project-message", async (data) => {


    const message = data.message;
    await projectModel.findByIdAndUpdate(
    socket.roomId,
    {
        $push: {
            messages: {
                senderId: data.sender._id,
                senderEmail: data.sender.email,
                message: data.message,
            },
        },
    }
);

io.to(socket.roomId).emit("project-message", data);
    const aiIsPresentInMessage = message
        .toLowerCase()
        .includes("@ai");


    if (aiIsPresentInMessage) {


        const prompt = message
            .replace(/@ai/gi, "")
            .trim();



        try {
const latestProject = await projectModel.findById(socket.roomId);

const fileSelection = await selectRelevantFiles(
    prompt,
    latestProject.fileTree || {}
);


let selectedFilesResponse;

try {

    const cleanedSelection = cleanAIResponse(fileSelection);

    selectedFilesResponse = JSON.parse(cleanedSelection);

} catch (err) {

    throw err;
}

const selectedFileTree = {};

for (const path of selectedFilesResponse.files || []) {

    if (latestProject.fileTree[path]) {

        selectedFileTree[path] = latestProject.fileTree[path];

    }

}

const result = await generateResult(
    prompt,
    selectedFileTree
);

const cleanedResult = result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const aiResponse = JSON.parse(
    cleanAIResponse(result)
);
const refreshedProject = await projectModel.findById(socket.roomId);

const updatedFileTree = {
    ...(refreshedProject.fileTree || {})
};

for (const operation of aiResponse.operations || []) {

    // ---------------- CREATE ----------------

    if (operation.type === "create") {

        updatedFileTree[operation.path] = {
            file: {
                contents: operation.contents,
            },
        };

        continue;
    }

    // ---------------- REPLACE ----------------

if (operation.type === "replace") {

    const existingFile = updatedFileTree[operation.path];

    if (!existingFile) {
        continue;

    }

    let contents = existingFile.file.contents;

    // ---------- Exact Match ----------

    if (contents.includes(operation.find)) {

        contents = contents.replace(
            operation.find,
            operation.replace
        );

    }

    // ---------- Whitespace Match ----------

    else {

        const normalizedContents = normalizeWhitespace(contents);
        const normalizedFind = normalizeWhitespace(operation.find);

        if (normalizedContents.includes(normalizedFind)) {

            const escaped = operation.find
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                .replace(/\s+/g, "\\s+");

            const regex = new RegExp(escaped);

            contents = contents.replace(
                regex,
                operation.replace
            );


        } else {

            continue;

        }

    }

    updatedFileTree[operation.path] = {
        ...existingFile,
        file: {
            ...existingFile.file,
            contents,
        },
    };

}

}
// Save generated files to database
await projectModel.findByIdAndUpdate(
    socket.roomId,
    {
        fileTree: updatedFileTree,

        $push: {
            messages: {
                senderId: "AI",
                senderEmail: "AI Assistant",
                message: aiResponse.message,
            },
        },
    }
);

io.to(socket.roomId).emit("project-message", {
    message: aiResponse.message,
    fileTree: updatedFileTree,
    sender: {
        email: "AI Assistant",
        _id: "AI",
    },
});

            return;

        } catch (err) {

            console.error("AI ERROR");
            console.error(err);

            io.to(socket.roomId).emit("project-message", {
                message: "AI failed to generate a valid response.",
                sender: {
                    email: "AI Assistant",
                    _id: "AI",
                },
            });

            return;
        }
    };

});
socket.on("file-update", async (data) => {

    try {

        await projectModel.findByIdAndUpdate(
            socket.roomId,
            {
                fileTree: data.fileTree
            }
        );

        socket.broadcast.to(socket.roomId).emit("file-update", {
            fileTree: data.fileTree
        });

    } catch (err) {
        console.error(err);
    }

});

socket.on("typing-start", (data) => {

    socket.broadcast
        .to(socket.roomId)
        .emit("typing-start", {
            userId: data.userId,
            email: data.email,
        });

});

socket.on("typing-stop", (data) => {

    socket.broadcast
        .to(socket.roomId)
        .emit("typing-stop", {
            userId: data.userId,
        });

});
socket.on("disconnect", () => {

    onlineUsers.delete(socket.user._id);

    io.to(socket.roomId).emit("online-users", [
        ...onlineUsers.entries()
            .filter(([_, user]) => user.roomId === socket.roomId)
            .map(([userId]) => userId)
    ]);

});
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})