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
    console.log("Socket connected", socket.id);
    socket.roomId = socket.project._id.toString();

    console.log("a user connected");
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

console.log("========== FILE SELECTION ==========");
console.log(fileSelection);

let selectedFilesResponse;

try {

    const cleanedSelection = cleanAIResponse(fileSelection);

    selectedFilesResponse = JSON.parse(cleanedSelection);

    console.log("Parsed Selection:");
    console.log(selectedFilesResponse);

} catch (err) {

    console.log("RAW FILE SELECTION:");
    console.log(fileSelection);

    console.log("CLEANED FILE SELECTION:");
    console.log(cleanAIResponse(fileSelection));

    throw err;
}

const selectedFileTree = {};

for (const path of selectedFilesResponse.files || []) {

    if (latestProject.fileTree[path]) {

        selectedFileTree[path] = latestProject.fileTree[path];

    }

}

console.log("========== SELECTED FILES ==========");
console.log(Object.keys(selectedFileTree));
console.log("====================================");

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
console.log("========== AI RESPONSE ==========");
console.log(JSON.stringify(aiResponse, null, 2));
console.log("=================================");
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

        console.log(`File not found: ${operation.path}`);
        continue;

    }

    let contents = existingFile.file.contents;

    // ---------- Exact Match ----------

    if (contents.includes(operation.find)) {

        contents = contents.replace(
            operation.find,
            operation.replace
        );

        console.log(`Patched ${operation.path} (Exact Match)`);

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

            console.log(`Patched ${operation.path} (Whitespace Match)`);

        } else {

            console.log(`Patch failed in ${operation.path}`);
            console.log("Could not find:");
            console.log(operation.find);

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
console.log("========== UPDATED FILE TREE ==========");
console.log(Object.keys(updatedFileTree));
console.log("=======================================");
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
    console.log("Backend received file-update");

    try {

        await projectModel.findByIdAndUpdate(
            socket.roomId,
            {
                fileTree: data.fileTree
            }
        );
        console.log("Broadcasting to room:", socket.roomId);

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

    console.log("user disconnected");
});
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})