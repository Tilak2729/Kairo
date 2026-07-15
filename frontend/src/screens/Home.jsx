import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

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
            <p className="text-xs text-[#6a9955]">// workspace</p>
            <h1 className="text-2xl font-semibold text-[#4ec9b0]">
              My Projects
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0e639c] text-white px-4 py-2 rounded text-sm hover:bg-[#1177bb] transition"
          >
            <span className="text-[#4ec9b0]">+</span> New Project
          </button>
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
              <div className="flex items-center gap-3">
                <i className="ri-folder-line text-[#dcb67a] text-lg"></i>

                <h2 className="text-base font-medium text-[#9cdcfe] lowercase group-hover:text-[#4fc1ff] transition">
                  {project.name}
                </h2>
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
    </main>
  );
};

export default Home;



