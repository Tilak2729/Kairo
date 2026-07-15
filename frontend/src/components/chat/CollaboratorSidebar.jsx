const CollaboratorSidebar = ({
    isOpen,
    setIsOpen,
    project,
    onlineUsers,
}) => {

    return (
        <div
            className={`sidePanel w-full h-full flex flex-col gap-2 bg-[#252526] absolute transition-all duration-200 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } top-0 z-30`}
        >
            <header className="flex justify-between items-center px-4 h-11 bg-[#2d2d2d] border-b border-[#3c3c3c]">
                <h1 className="font-semibold text-sm tracking-wide text-[#cccccc]">
                    Collaborators
                </h1>

                <button
                    onClick={() => setIsOpen(false)}
                    title="Close"
                    className="p-1.5 rounded-sm cursor-pointer text-[#cccccc]/70 hover:text-[#cccccc] hover:bg-[#3c3c3c] transition-colors duration-100"
                >
                    <i className="ri-close-fill text-base"></i>
                </button>
            </header>

            <div className="users flex flex-col gap-0.5 px-1">

                {project.users &&
                    project.users.map((user) => {

                        <div
                            key={user._id}
                            className="user cursor-pointer hover:bg-[#2a2d2e] rounded-sm p-2 flex gap-3 items-center transition-colors duration-100"
                        >

                            <div className="relative shrink-0">

                                <div className="aspect-square rounded-full w-9 h-9 flex items-center justify-center text-[#cccccc] bg-[#3c3c3c]">
                                    <i className="ri-user-fill text-sm"></i>
                                </div>

                                <span
                                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#252526] ${
                                        onlineUsers.includes(user._id)
                                            ? "bg-[#89d185]"
                                            : "bg-[#6a6a6a]"
                                    }`}
                                />

                            </div>

                            <h1 className="font-medium text-sm text-[#cccccc] truncate">
                                {user.email}
                            </h1>

                        </div>

})}

            </div>

        </div>
    );

};

export default CollaboratorSidebar;