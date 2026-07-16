import React, { useState } from "react";

const AddCollaboratorModal = ({
    isOpen,
    setIsOpen,
    users,
    selectedUserId,
    handleUserClick,
    addCollaborators,
    project,
}) => {
const [search, setSearch] = useState("");
    if (!isOpen) return null;
const availableUsers = users
    .filter(
        (user) =>
            !project.users.some(
                (member) => member._id === user._id
            )
    )
    .filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-[#252526] border border-[#3c3c3c] rounded-md w-[440px] max-h-[80vh] flex flex-col shadow-2xl">

                <header className="flex justify-between items-center h-11 px-4 border-b border-[#2d2d2d]">

                    <h2 className="text-[13px] font-semibold text-white tracking-wide">
                        Add Collaborators
                    </h2>

                    <button
                        onClick={() => setIsOpen(false)}
                        title="Close"
                        className="p-1 rounded-sm text-[#858585] hover:text-[#cccccc] hover:bg-[#3c3c3c] transition-colors duration-100"
                    >
                        <i className="ri-close-fill text-base"></i>
                    </button>

                </header>
                <div className="p-3 border-b border-[#2d2d2d]">

    <input
        type="text"
        placeholder="Search collaborators..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-sm px-3 py-2 text-sm text-white outline-none focus:border-[#3794ff]"
    />

</div>

                <div className="flex-1 overflow-y-auto py-1">

{
    availableUsers.length > 0 ? (

        availableUsers.map((user) => (

            <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className={`group flex items-center gap-3 px-4 py-2.5 cursor-pointer border-l-2 transition-colors duration-100
                ${
                    selectedUserId.has(user._id)
                        ? "bg-[#37373d] border-[#3794ff]"
                        : "border-transparent hover:bg-[#2a2d2e]"
                }`}
            >

                <div className="relative w-8 h-8 rounded-full bg-[#0e639c] flex justify-center items-center text-white font-semibold shrink-0 uppercase">
                    {user.email.charAt(0)}

                    {
                        selectedUserId.has(user._id) && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#3794ff] border-2 border-[#252526] flex items-center justify-center">
                                <i className="ri-check-line text-[8px] text-white"></i>
                            </span>
                        )
                    }
                </div>

                <div className="min-w-0">

                    <h3 className="text-[13px] font-medium text-[#e6e6e6] truncate">
                        {user.email}
                    </h3>

                </div>

            </div>

        ))

    ) : (

        <div className="flex flex-col items-center justify-center gap-2 h-40 text-[#858585]">
            <i className="ri-team-line text-2xl"></i>
            <p className="text-[13px]">All users are already collaborators.</p>
        </div>

    )
}
                </div>

                <div className="p-3 border-t border-[#2d2d2d]">

                    <button
                        onClick={addCollaborators}
                        disabled={selectedUserId.size === 0}

                        className={`w-full text-white text-[13px] font-medium py-2 rounded-sm transition-colors duration-100
                        ${
                            selectedUserId.size === 0
                            ? "bg-[#3c3c3c] cursor-not-allowed"
                            : "bg-[#0e639c] hover:bg-[#1177bb]"
                        }`}
                    >
                       {
    selectedUserId.size === 0
        ? "Select Collaborators"
        : selectedUserId.size === 1
        ? "Add Collaborator"
        : `Add ${selectedUserId.size} Collaborators`
}
                    </button>

                </div>

            </div>

        </div>
    );

};

export default AddCollaboratorModal;