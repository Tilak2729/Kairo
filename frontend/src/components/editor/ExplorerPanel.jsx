const ExplorerPanel = ({
    fileTree,
    currentFile,
    setCurrentFile,
    onCreateFiles,
    explorerWidth,
}) => {

    return (

        <div
    style={{ width: `${explorerWidth}px` }}
    className="bg-[#252526] border-r border-gray-700 flex-shrink-0"
>

            <button
                className="w-full bg-blue-600 py-2"
                onClick={onCreateFiles}
            >
                Create Files
            </button>

            {

                Object.keys(fileTree).map(file => (

                    <div
                        key={file}
                        onClick={() => setCurrentFile(file)}
                        className={`p-3 cursor-pointer hover:bg-[#3e3e42]
                        ${
                            currentFile === file
                                ? "bg-[#37373d]"
                                : ""
                        }`}
                    >
                        {file}
                    </div>

                ))

            }

        </div>

    );

};

export default ExplorerPanel;