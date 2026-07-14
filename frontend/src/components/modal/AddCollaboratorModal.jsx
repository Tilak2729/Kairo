const AddCollaboratorModal = ({
    isOpen,
    setIsOpen,
    users,
    selectedUserId,
    handleUserClick,
    addCollaborators,
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg w-[500px] max-h-[80vh] flex flex-col">

                <header className="flex justify-between items-center p-4 border-b">

                    <h2 className="text-lg font-semibold">
                        Add Collaborators
                    </h2>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-xl"
                    >
                        <i className="ri-close-fill"></i>
                    </button>

                </header>

                <div className="flex-1 overflow-y-auto">

                    {
                        users.map(user => (

                            <div
                                key={user._id}
                                onClick={() => handleUserClick(user._id)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100
                                ${
                                    selectedUserId.has(user._id)
                                        ? "bg-blue-100"
                                        : ""
                                }`}
                            >

                                <div className="w-10 h-10 rounded-full bg-slate-600 flex justify-center items-center text-white">

                                    <i className="ri-user-fill"></i>

                                </div>

                                <div>

                                    <h3 className="font-medium">
                                        {user.email}
                                    </h3>

                                </div>

                            </div>

                        ))
                    }

                </div>

                <div className="p-4 border-t">

                    <button
                        onClick={addCollaborators}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Add Collaborators
                    </button>

                </div>

            </div>

        </div>
    );

};

export default AddCollaboratorModal;