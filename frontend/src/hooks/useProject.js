import { useEffect, useState } from "react";
import axios from "../config/axios";

const useProject = (initialProject) => {

    const [project, setProject] = useState(initialProject);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [fileTree, setFileTree] = useState({});

    useEffect(() => {

        if (!initialProject?._id) return;

        axios
            .get(`/projects/get-project/${initialProject._id}`)
            .then((res) => {

                const projectData = res.data.project;

                setProject(projectData);

                setFileTree(projectData.fileTree || {});

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
            .catch(console.error);

        axios
            .get("/users/all")
            .then((res) => {

                setUsers(res.data.users);

            })
            .catch(console.error);

    }, [initialProject?._id]);

    return {

        project,
        setProject,

        users,
        setUsers,

        messages,
        setMessages,

        fileTree,
        setFileTree,

    };

};

export default useProject;