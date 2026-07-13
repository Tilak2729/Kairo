import React,{useState, useEffect, useContext, useRef} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Editor from "@monaco-editor/react";
import axios from '../config/axios'
import {
    initializeSocket,
    receiveMessage,
    sendMessage,
    sendFileUpdate,
    disconnectSocket
} from "../config/socket";
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx';


const Project = () => {
    const location = useLocation();
    console.log(location.state)
    const [isSidePanelOpen, setisSidePanelOpen] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) ;
    const [ project, setProject ] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const {user} = useContext(UserContext)
    const messageBox = useRef(null);
    const saveTimeout = React.useRef(null);
    const isRemoteUpdate = React.useRef(false);
    const typingTimeout = React.useRef(null);
const isTyping = React.useRef(false);
    const messagesEndRef = useRef(null);
    


    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [fileTree, setFileTree] = useState({});
const [currentFile, setCurrentFile] = useState(null);
const [openFiles, setOpenFiles] = useState([]);
const [onlineUsers, setOnlineUsers] = useState([]);
const [typingUser, setTypingUser] = useState(null);
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
            projectId: location.state.project._id,
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


  useEffect(() => {

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

    console.log("Live File Update");

    isRemoteUpdate.current = true;

    setFileTree(data.fileTree);

});
receiveMessage("online-users", (users) => {

    console.log("Online Users:", users);

    setOnlineUsers(users);

});
receiveMessage("typing-start", (data) => {

    setTypingUser(data.email);

});

receiveMessage("typing-stop", () => {

    setTypingUser(null);

});

axios.get(`/projects/get-project/${location.state.project._id}`)
.then(res => {

    const projectData = res.data.project;

    setProject(projectData);

    if (projectData.fileTree) {
        setFileTree(projectData.fileTree);
    }

    if (projectData.messages) {

const loadedMessages = projectData.messages.map((msg) => ({
    sender: {
        _id: msg.senderId,
        email: msg.senderEmail,
    },
    message: msg.message,
}));

        setMessages(loadedMessages);
    }

})
.catch(err => console.log(err));


axios.get('/users/all')
.then(res => {
    setUsers(res.data.users);
})
.catch(err => {
    console.log(err);
});

return () => {
    disconnectSocket();
};

}, []);
useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
    });

}, [messages]);


    
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

      <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">

        <div
          ref={messageBox}
          className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${msg.sender._id === "AI" ? "max-w-80" : "max-w-52"}
              ${msg.sender._id === user?._id ? "ml-auto" : ""}
              message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
            >
              <small className="opacity-65 text-xs">
                {msg.sender.email}
              </small>

              <div className="text-sm">
                {msg.sender._id === "AI"
                  ? WriteAiMessage(msg.message)
                  : <p>{msg.message}</p>}
              </div>
            </div>
          ))
          }
          {typingUser && (
    <div className="message flex flex-col p-2 bg-slate-50 w-fit rounded-md max-w-52">
        <small className="opacity-65 text-xs">
            {typingUser}
        </small>

        <div className="flex items-center gap-1 py-1 px-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
            ></span>
            <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
            ></span>
        </div>
    </div>
)}
<div ref={messagesEndRef}></div>
        </div>

        <div className="inputField w-full flex absolute bg-white bottom-0">
<input
    value={message}
onChange={(e) => {

    setMessage(e.target.value);

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

}}
onKeyDown={(e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        send();

    }

}}
    className="p-2 px-4 border-none outline-none flex-grow"
    type="text"
    placeholder="Enter message"
/>

          <button
            onClick={send}
            className="px-5 bg-slate-950 text-white"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>

      <div
        className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
          isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
        } top-0 z-30`}
      >
        <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
          <h1 className="font-semibold text-lg">
            Collaborators
          </h1>

          <button
            onClick={() => setisSidePanelOpen(!isSidePanelOpen)}
            className="p-2 cursor-pointer"
          >
            <i className="ri-close-fill"></i>
          </button>
        </header>

        <div className="users flex flex-col gap-2">
          {project.users &&
            project.users.map((user) => (
<div
    key={user._id}
    className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-3 items-center"
>
    <div className="relative">
        <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
            <i className="ri-user-fill absolute"></i>
        </div>

        <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                onlineUsers.includes(user._id)
                    ? "bg-green-500"
                    : "bg-gray-400"
            }`}
        />
    </div>

    <div>
        <h1 className="font-semibold">{user.email}</h1>
        <p className="text-xs text-gray-500">
            {onlineUsers.includes(user._id)
                ? "Online"
                : "Offline"}
        </p>
    </div>
</div>
            ))}
        </div>
      </div>

    </section>

    {/* RIGHT PANEL */}
    <section className="flex-1 bg-[#1e1e1e] text-white flex flex-col">

      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">
          Code Editor
        </h2>
      </div>

<div className="flex flex-1 overflow-hidden">

    {/* File Explorer */}

    <div className="w-56 bg-[#252526] border-r border-gray-700">

        <button
            className="w-full bg-blue-600 py-2"
            onClick={() => {

                setFileTree({
                    "index.html": {
                        file: {
                            contents:
                                "<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello</h1>\n</body>\n</html>"
                        }
                    },

                    "style.css": {
                        file: {
                            contents:
                                "body{\nbackground:black;\ncolor:white;\n}"
                        }
                    },

                    "script.js": {
                        file: {
                            contents:
                                "console.log('Hello');"
                        }
                    }
                });

                setCurrentFile("index.html");

            }}
        >
            Create Files
        </button>

        {

            Object.keys(fileTree).map(file => (

                <div
                    key={file}
                    onClick={() => setCurrentFile(file)}
                    className={`p-3 cursor-pointer hover:bg-[#3e3e42]
                    ${currentFile === file ? "bg-[#37373d]" : ""}`}
                >
                    {file}
                </div>

            ))

        }

    </div>

    {/* Monaco */}

    <div className="flex-1">

        <Editor
            height="100%"
            theme="vs-dark"
            language={
                currentFile?.endsWith(".html")
                    ? "html"
                    : currentFile?.endsWith(".css")
                    ? "css"
                    : "javascript"
            }
            value={
                currentFile
                    ? fileTree[currentFile]?.file?.contents
                    : ""
            }
onChange={(value) => {

    if (!currentFile) return;

    if (isRemoteUpdate.current) {

    isRemoteUpdate.current = false;

    return;
}

    const updatedFileTree = {

        ...fileTree,

        [currentFile]: {

            ...fileTree[currentFile],

            file: {

                ...fileTree[currentFile].file,

                contents: value

            }

        }

    };

    setFileTree(updatedFileTree);

if (saveTimeout.current) {
    clearTimeout(saveTimeout.current);
}

saveTimeout.current = setTimeout(() => {
    sendFileUpdate(updatedFileTree);
    console.log("Auto Saved");
}, 1000);

}}
        />

    </div>

</div>

    </section>

    {/* MODAL */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md w-96 max-w-full relative">

          <header className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Select User
            </h2>

            <button
              onClick={() => setIsModalOpen(false)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className={`user cursor-pointer hover:bg-slate-200 ${
                  Array.from(selectedUserId).includes(user._id)
                    ? "bg-slate-200"
                    : ""
                } p-2 flex gap-2 items-center`}
              >
                <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                  <i className="ri-user-fill absolute"></i>
                </div>

                <h1 className="font-semibold text-lg">
                  {user.email}
                </h1>
              </div>
            ))}
          </div>

          <button
            onClick={addCollaborators}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Collaborators
          </button>

        </div>
      </div>
    )}

  </main>
);

}


export default Project