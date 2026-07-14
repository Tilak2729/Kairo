import React,{useState, useEffect, useContext, useRef} from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import {
    sendMessage,
    sendFileUpdate
} from "../config/socket";
import { UserContext } from '../context/user.context'
import EditorPanel from "../components/editor/EditorPanel";
import AddCollaboratorModal from "../components/modal/AddCollaboratorModal";
import CollaboratorSidebar from "../components/chat/CollaboratorSidebar";
import ChatPanel from "../components/chat/ChatPanel";
import useProject from "../hooks/useProject";
import useSocketConnection from "../hooks/useSocketConnection";
import useTyping from "../hooks/useTyping";
import Markdown from 'markdown-to-jsx';


const Project = () => {
    const location = useLocation();
    console.log(location.state)
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
    users,
    messages,
    setMessages,
    fileTree,
    setFileTree,
} = useProject(location.state.project);
    



const [currentFile, setCurrentFile] = useState(null);
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

  function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

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
        <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2 whitespace-pre'>
            <Markdown
                children={message}
            />
        </div>
    );
};





    
return (
  <main className="h-screen w-screen flex">

    {/* LEFT PANEL */}
    <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">

      <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-200 absolute z-20 top-0">
        <button
          className="flex gap-2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="ri-add-large-fill mr-1"></i>
          <p>Add Collaborators</p>
        </button>

        <button
          onClick={() => setisSidePanelOpen(!isSidePanelOpen)}
          className="p-2 cursor-pointer"
        >
          <i className="ri-group-fill"></i>
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
/>

    </section>

    <EditorPanel
    fileTree={fileTree}
    setFileTree={setFileTree}
    currentFile={currentFile}
    setCurrentFile={setCurrentFile}
    saveTimeout={saveTimeout}
    isRemoteUpdate={isRemoteUpdate}
    sendFileUpdate={sendFileUpdate}
/>


    {/* MODAL */}
<AddCollaboratorModal
    isOpen={isModalOpen}
    setIsOpen={setIsModalOpen}
    users={users}
    selectedUserId={selectedUserId}
    handleUserClick={handleUserClick}
    addCollaborators={addCollaborators}
/>

  </main>
);

}


export default Project