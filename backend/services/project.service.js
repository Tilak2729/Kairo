import projectModel from '../models/project.model.js';
import mongoose from "mongoose";
import User from '../models/user.model.js';

export const createProject = async ({
    name, userId
}) => {
    if (!name) throw new Error('Project name is required');
    if (!userId) throw new Error('User ID is required');

    let project;
    try {
        project = await projectModel.create({
            name,
            owner: userId,
            users: [ userId ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;
}


export const getAllProjectByUserId = async ({userId}) => {
    if(!userId){
        throw new Error('User id is required')
    }

    const projects = await projectModel.find({
    users: userId
}).populate("owner", "email");

return projects;
}

export const addUsersToProject = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }


    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    console.log(project)

    if (!project) {
        throw new Error("User not belong to this project")
    }

const updatedProject = await projectModel
    .findOneAndUpdate(
        {
            _id: projectId,
        },
        {
            $addToSet: {
                users: {
                    $each: users,
                },
            },
        },
        {
            new: true,
        }
    )
    .populate("users", "email");

return updatedProject;



}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users', 'email')

    return project;
}
export const renameProject = async ({ projectId, name }) => {
    if (!projectId) {
        throw new Error("projectId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    if (!name || !name.trim()) {
        throw new Error("Project name is required");
    }

    const updatedProject = await projectModel.findOneAndUpdate(
        {
            _id: projectId,
        },
        {
            name: name.trim(),
        },
        {
            new: true,
        }
    );

    if (!updatedProject) {
        throw new Error("Project not found");
    }

    return updatedProject;
};

export const deleteProject = async ({ projectId, userId }) => {

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project id");
    }

    const project = await projectModel.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.owner.toString() !== userId.toString()) {
        throw new Error("Only owner can delete project");
    }

    await project.deleteOne();

    return {
        message: "Project deleted successfully",
    };
};
export const leaveProject = async ({ projectId, userId }) => {

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project id");
    }

    const project = await projectModel.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.owner.toString() === userId.toString()) {
        throw new Error("Owner cannot leave the project");
    }

    await projectModel.findByIdAndUpdate(
        projectId,
        {
            $pull: {
                users: userId,
            },
        },
        {
            new: true,
        }
    );

    return {
        message: "Left project successfully",
    };
};