import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
const [renameProject, setRenameProject] = useState(null);
const [renameName, setRenameName] = useState("");
const [deleteProject, setDeleteProject] = useState(null);
const [leaveProject, setLeaveProject] = useState(null);
  const profileMenuRef = useRef(null);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/all");
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {

    const handleClickOutside = (event) => {

        if (
            profileMenuRef.current &&
            !profileMenuRef.current.contains(event.target)
        ) {
            setIsProfileOpen(false);
        }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {

        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );

    };

}, []);

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) return;

    try {
      const res = await axios.post("/projects/create", {
        name: projectName.trim(),
      });

      // Add new project immediately
      setProjects((prev) => [...prev, res.data]);

      // Clear input
      setProjectName("");

      // Close modal
      setIsModalOpen(false);

      // OPTIONAL:
      // If you want to directly open the project after creating it,
      // uncomment these lines and remove the setProjects line above.

      /*
      navigate("/project", {
        state: {
          project: res.data,
        },
      });
      */

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Unable to create project."
      );
    }
  };
  const renameProjectHandler = async () => {

    if (!renameName.trim()) return;

    try {

        const res = await axios.patch("/projects/rename", {
            projectId: renameProject._id,
            name: renameName.trim(),
        });

        setProjects((prev) =>
            prev.map((project) =>
                project._id === renameProject._id
                    ? res.data.project
                    : project
            )
        );

        setRenameProject(null);
        setRenameName("");

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.message ||
            "Unable to rename project."
        );

    }

};
const deleteProjectHandler = async () => {

    try {

        await axios.delete(`/projects/${deleteProject._id}`);

        setProjects(prev =>
            prev.filter(
                project => project._id !== deleteProject._id
            )
        );

        setDeleteProject(null);

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.error ||
            "Unable to delete project."
        );

    }

};
const leaveProjectHandler = async () => {

    try {

        await axios.patch(
            `/projects/leave/${leaveProject._id}`
        );

        setProjects(prev =>
            prev.filter(
                project =>
                    project._id !== leaveProject._id
            )
        );

        setLeaveProject(null);

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.error ||
            "Unable to leave project."
        );

    }

};
  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

    navigate("/login", {
        replace: true,
    });

};

  return (
    <main className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono">
      {/* Title bar */}
      <div className="border-b border-[#2d2d2d] bg-[#252526] px-6 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
        </div>
        <span className="ml-3 text-xs text-[#858585] tracking-wide">
          projects — explorer
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

<div className="flex justify-between items-center mb-8">

    <div>

        <p className="text-xs text-[#6a9955]">
            // workspace
        </p>

        <h1 className="text-2xl font-semibold text-[#4ec9b0]">
            My Projects
        </h1>

    </div>

    <div className="flex items-center gap-3">

        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0e639c] text-white px-4 py-2 rounded text-sm hover:bg-[#1177bb] transition"
        >
            <span className="text-[#4ec9b0]">+</span>
            New Project
        </button>

        <div 
        ref={profileMenuRef}
        className="relative">

            <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="w-10 h-10 rounded-full bg-[#0e639c] text-white font-semibold uppercase hover:bg-[#1177bb] transition"
            >
                {user?.email?.charAt(0)}
            </button>

            {
                isProfileOpen && (

                    <div className="absolute right-0 mt-2 w-64 bg-[#252526] border border-[#3c3c3c] rounded-md shadow-xl z-50">

                        <div className="px-4 py-3 border-b border-[#3c3c3c]">

                            <p className="text-xs text-[#858585]">
                                Signed in as
                            </p>

                            <p className="text-sm text-[#cccccc] truncate mt-1">
                                {user?.email}
                            </p>

                        </div>

                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-3 flex items-center gap-2 text-[#f48771] hover:bg-[#2d2d2d] transition"
                        >
                            <i className="ri-logout-box-r-line"></i>

                            Logout
                        </button>

                    </div>

                )
            }

        </div>

    </div>

</div>

        {/* Vertical, centered file list */}
        <div className="flex flex-col gap-3">

          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() =>
                navigate("/project", {
                  state: {
                    project,
                  },
                })
              }
              className="group bg-[#252526] border border-[#333333] rounded-md px-5 py-4 hover:border-[#0e639c] hover:bg-[#2a2d2e] transition cursor-pointer"
            >
<div className="flex justify-between items-start">

    <div className="flex items-center gap-3">

        <i className="ri-folder-line text-[#dcb67a] text-lg"></i>

        <h2 className="text-base font-medium text-[#9cdcfe] lowercase group-hover:text-[#4fc1ff] transition">
            {project.name}
        </h2>

    </div>

<div className="relative">

    <button
        onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(
                menuOpen === project._id ? null : project._id
            );
        }}
        className="text-[#858585] hover:text-white p-1 rounded"
    >
        <i className="ri-more-2-fill"></i>
    </button>

{menuOpen === project._id && (
    <div className="absolute right-0 mt-2 w-44 bg-[#252526] border border-[#3c3c3c] rounded shadow-lg z-50">

        {project.owner?._id === user?._id ? (
            <>

                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        setRenameProject(project);
                        setRenameName(project.name);

                        setMenuOpen(null);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[#2d2d2d]"
                >
                    Rename Project
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        setDeleteProject(project);

                        setMenuOpen(null);
                    }}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-[#2d2d2d]"
                >
                    Delete Project
                </button>

            </>
        ) : (
            <button
                onClick={(e) => {
                    e.stopPropagation();

                    setLeaveProject(project);

                    setMenuOpen(null);
                }}
                className="w-full text-left px-4 py-3 text-yellow-400 hover:bg-[#2d2d2d]"
            >
                Leave Project
            </button>
        )}

    </div>
)}

</div>

</div>

              <div className="mt-2 ml-7 flex items-center gap-2 text-[#6a9955] text-sm">
                <i className="ri-user-3-line"></i>
                <span>
                  // {project.users.length} collaborator
                  {project.users.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center text-[#6a9955] text-sm py-10 border border-dashed border-[#333333] rounded-md">
              // no projects yet — create one to get started
            </div>
          )}

        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

          <div className="bg-[#252526] border border-[#3c3c3c] rounded-md p-6 w-[400px] shadow-2xl">

            <h2 className="text-base font-semibold mb-1 text-[#4ec9b0]">
              Create Project
            </h2>
            <p className="text-xs text-[#6a9955] mb-5">// name your new project</p>

            <form onSubmit={createProject}>

              <input
                type="text"
                placeholder="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                className="w-full bg-[#3c3c3c] text-[#d4d4d4] placeholder-[#858585] border border-[#3c3c3c] rounded p-3 text-sm outline-none focus:border-[#0e639c] focus:ring-1 focus:ring-[#0e639c]"
              />

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => {
                    setProjectName("");
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 rounded text-sm bg-[#3c3c3c] text-[#d4d4d4] hover:bg-[#4a4a4a] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded text-sm bg-[#0e639c] text-white hover:bg-[#1177bb] transition"
                >
                  Create
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
      {
    renameProject && (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

            <div className="bg-[#252526] border border-[#3c3c3c] rounded-md p-6 w-[400px]">

                <h2 className="text-base font-semibold text-[#4ec9b0]">
                    Rename Project
                </h2>

                <p className="text-xs text-[#6a9955] mb-5">
                    // enter a new project name
                </p>

                <input
                    type="text"
                    value={renameName}
                    onChange={(e) =>
                        setRenameName(e.target.value)
                    }
                    className="w-full bg-[#3c3c3c] p-3 rounded outline-none"
                />

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={() => {
                            setRenameProject(null);
                            setRenameName("");
                        }}
                        className="px-4 py-2 bg-[#3c3c3c] rounded"
                    >
                        Cancel
                    </button>

                   <button
    onClick={renameProjectHandler}
    className="px-4 py-2 bg-[#0e639c] rounded"
>
    Save
</button>

                </div>

            </div>

        </div>

    )
}
{
deleteProject && (

<div className="fixed inset-0 bg-black/60 flex justify-center items-center">

<div className="bg-[#252526] border border-[#3c3c3c] rounded-md p-6 w-[400px]">

<h2 className="text-lg font-semibold text-red-400">
Delete Project
</h2>

<p className="text-sm mt-3 text-[#cccccc]">
This action cannot be undone.
</p>

<div className="flex justify-end gap-3 mt-8">

<button
onClick={() => setDeleteProject(null)}
className="px-4 py-2 bg-[#3c3c3c] rounded"
>
Cancel
</button>

<button
onClick={deleteProjectHandler}
className="px-4 py-2 bg-red-600 rounded"
>
Delete
</button>

</div>

</div>

</div>

)
}
{
leaveProject && (

<div className="fixed inset-0 bg-black/60 flex justify-center items-center">

<div className="bg-[#252526] border border-[#3c3c3c] rounded-md p-6 w-[400px]">

<h2 className="text-lg font-semibold text-yellow-400">
Leave Project
</h2>

<p className="text-sm mt-3 text-[#cccccc]">
You will lose access to this project.
</p>

<div className="flex justify-end gap-3 mt-8">

<button
onClick={() => setLeaveProject(null)}
className="px-4 py-2 bg-[#3c3c3c] rounded"
>
Cancel
</button>

<button
onClick={leaveProjectHandler}
className="px-4 py-2 bg-yellow-600 rounded"
>
Leave
</button>

</div>

</div>

</div>

)
}
    </main>
  );
};

export default Home;



