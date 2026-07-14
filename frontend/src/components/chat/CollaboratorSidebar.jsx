const CollaboratorSidebar = ({
    isOpen,
    setIsOpen,
    project,
    onlineUsers,
}) => {

    return (
        <div
            className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } top-0 z-30`}
        >
            <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
                <h1 className="font-semibold text-lg">
                    Collaborators
                </h1>

                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 cursor-pointer"
                >
                    <i className="ri-close-fill"></i>
                </button>
            </header>

            <div className="users flex flex-col gap-2">

                {project.users &&
                    project.users.map((user) => {

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

                            <h1 className="font-semibold text-lg">
                                {user.email}
                            </h1>

                        </div>

})}

            </div>

        </div>
    );

};

export default CollaboratorSidebar;