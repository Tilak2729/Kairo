import React,{useState, useEffect, useContext, useRef} from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import toast from "react-hot-toast";
import {
    sendMessage,
    sendFileUpdate
} from "../config/socket";
import { UserContext } from '../context/user.context'
import EditorWorkspace from "../components/editor/EditorWorkspace";
import AddCollaboratorModal from "../components/modal/AddCollaboratorModal";
import CollaboratorSidebar from "../components/chat/CollaboratorSidebar";
import ChatPanel from "../components/chat/ChatPanel";
import useProject from "../hooks/useProject";
import useSocketConnection from "../hooks/useSocketConnection";
import useTyping from "../hooks/useTyping";
import { starterProject } from "../utils/starterProject";
import Workspace from "../components/layout/Workspace";
import useResizableLayout from "../hooks/useResizableLayout";
import Markdown from 'markdown-to-jsx';


const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setisSidePanelOpen] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) ;
    const [message, setMessage] = useState('')
    const {user} = useContext(UserContext)
    const messageBox = useRef(null);
    const saveTimeout = React.useRef(null);
    const isRemoteUpdate = React.useRef(false);
    
    const {
    project,
    setProject,
    users,
    messages,
    setMessages,
    fileTree,
    setFileTree,
} = useProject(location.state.project);
    
const {
    chatWidth,
    explorerWidth,
    startChatResize,
    startExplorerResize,
    isChatCollapsed,
    toggleChat,
    isExplorerCollapsed,
    toggleExplorer,
} = useResizableLayout();


const [currentFile, setCurrentFile] = useState(null);
const [openFiles, setOpenFiles] = useState([]);
const { onlineUsers } = useSocketConnection({
    project,
    setMessages,
    setFileTree,
    setCurrentFile,
    isRemoteUpdate,
});
const {
    typingUser,
    handleTyping,
} = useTyping(project, user);
    const handleUserClick = (id) => {
      setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
};
const handleFileOpen = (file) => {

    setOpenFiles((prev) => {

        if (prev.includes(file)) {
            return prev;
        }

        return [...prev, file];

    });

    setCurrentFile(file);

};
const handleCloseTab = (file) => {

    setOpenFiles((prev) => {

        const fileIndex = prev.indexOf(file);

        const updatedFiles = prev.filter(
            (openFile) => openFile !== file
        );

        if (file === currentFile) {

            if (updatedFiles.length === 0) {

                setCurrentFile(null);

            } else {

                const nextFile =
                    updatedFiles[fileIndex - 1] ||
                    updatedFiles[0];

                setCurrentFile(nextFile);

            }

        }

        return updatedFiles;

    });

};

function addCollaborators() {

    axios.put("/projects/add-user", {

        projectId: project._id,
        users: Array.from(selectedUserId),

    })
    .then((res) => {
        const addedUsers = users.filter((u) =>
            selectedUserId.has(u._id)
        );

        setProject(res.data.project);
        addedUsers.forEach((member) => {

    setMessages(prev => [
        ...prev,
        {
            sender: {
                _id: "system",
                email: "System",
            },
            message: `${member.email} joined the project`,
        },
    ]);

});

        

        setSelectedUserId(new Set());

        setIsModalOpen(false);

        if (addedUsers.length === 1) {

            toast.success(
                `${addedUsers[0].email} added to project`
            );

        } else {

            toast.success(
                `${addedUsers.length} collaborators added`
            );

        }

    })
    .catch((err) => {

        console.log(err);

        toast.error("Unable to add collaborators.");

    });

}
function createStarterFiles() {

    setFileTree(starterProject);

    setCurrentFile("index.html");

    setOpenFiles(["index.html"]);

}

function send() {

    if (!message.trim()) return;

    sendMessage("project-message", {
        message,
        sender: user,
    });

    setMessages(prev => [
        ...prev,
        {
            sender: user,
            message,
        },
    ]);

    setMessage("");

}

const WriteAiMessage = (message) => {
    return (
        <div
            className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] leading-relaxed rounded border border-[#2d2d2d] p-3 max-w-full min-w-0
            break-words whitespace-pre-wrap
            [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-hidden
            [&_code]:whitespace-pre-wrap [&_code]:break-words [&_code]:max-w-full
            [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto
            [&_img]:max-w-full"
        >
            <Markdown
                children={message}
            />
        </div>
    );
};

    
return (
  <main className="h-screen w-screen flex bg-[#1e1e1e] text-[#cccccc] font-sans antialiased">

    {/* LEFT PANEL */}
<Workspace

    chatWidth={chatWidth}
    startChatResize={startChatResize}
    isChatCollapsed={isChatCollapsed}
    toggleChat={toggleChat}

    left={

        <section className="relative flex flex-col h-full bg-[#1e1e1e] border-r border-[#2d2d2d]">

<header className="flex justify-between items-center h-11 px-3 w-full bg-[#252526] border-b border-[#2d2d2d] absolute z-20 top-0 select-none">

    <div className="flex items-center gap-1">

        <button
            onClick={toggleChat}
            title="Collapse panel"
            className="p-1.5 rounded-sm cursor-pointer text-[#cccccc]/70 hover:text-[#cccccc] hover:bg-[#2a2d2e] transition-colors duration-100"
        >
            <i className="ri-arrow-left-s-line text-base"></i>
        </button>

        <button
            className="flex items-center gap-1.5 cursor-pointer text-[12px] font-medium px-2.5 py-1.5 rounded-sm text-[#cccccc]/90 hover:bg-[#2a2d2e] hover:text-white transition-colors duration-100"
            onClick={() => setIsModalOpen(true)}
        >
            <i className="ri-add-large-fill text-[13px] text-[#3794ff]"></i>
            <p className="tracking-tight">Add Collaborators</p>
        </button>

    </div>

    <button
        onClick={() => setisSidePanelOpen(!isSidePanelOpen)}
        title="Toggle collaborators"
        className={`p-1.5 rounded-sm cursor-pointer transition-colors duration-100 ${
            isSidePanelOpen
                ? "text-[#3794ff] bg-[#2a2d2e]"
                : "text-[#cccccc]/70 hover:text-[#cccccc] hover:bg-[#2a2d2e]"
        }`}
    >
        <i className="ri-group-fill text-base"></i>
    </button>

</header>

            <ChatPanel
                messages={messages}
                user={user}
                message={message}
                setMessage={setMessage}
                send={send}
                typingUser={typingUser}
                messageBox={messageBox}
                WriteAiMessage={WriteAiMessage}
                handleTyping={handleTyping}
            />

            <CollaboratorSidebar
                isOpen={isSidePanelOpen}
                setIsOpen={setisSidePanelOpen}
                project={project}
                onlineUsers={onlineUsers}
                user={user}
            />

        </section>

    }

    center={

        <EditorWorkspace
            fileTree={fileTree}
            setFileTree={setFileTree}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            saveTimeout={saveTimeout}
            isRemoteUpdate={isRemoteUpdate}
            sendFileUpdate={sendFileUpdate}
            onCreateFiles={createStarterFiles}
            explorerWidth={explorerWidth}
            startExplorerResize={startExplorerResize}
            isExplorerCollapsed={isExplorerCollapsed}
            toggleExplorer={toggleExplorer}
            handleFileOpen={handleFileOpen}
            openFiles={openFiles}
            handleCloseTab={handleCloseTab}
        />

    }

/>


    {/* MODAL */}
<AddCollaboratorModal
    isOpen={isModalOpen}
    setIsOpen={setIsModalOpen}
    users={users}
    project={project}
    selectedUserId={selectedUserId}
    handleUserClick={handleUserClick}
    addCollaborators={addCollaborators}
    
/>

  </main>
);

}


export default Project