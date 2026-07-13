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
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            My Projects
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-5 py-3 rounded-lg hover:bg-slate-700 transition"
          >
            + New Project
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

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
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer p-5"
            >
              <h2 className="text-xl font-semibold capitalize">
                {project.name}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <i className="ri-user-3-line"></i>

                <span>
                  {project.users.length} Collaborator
                  {project.users.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white rounded-xl p-6 w-[400px]">

            <h2 className="text-xl font-semibold mb-5">
              Create Project
            </h2>

            <form onSubmit={createProject}>

              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-500"
              />

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => {
                    setProjectName("");
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
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



