const ExplorerPanel = ({
    fileTree,
    currentFile,
    setCurrentFile,
    onCreateFiles,
    explorerWidth,
    isExplorerCollapsed,
    toggleExplorer,
}) => {

    return (

<div
    style={{ width: `${explorerWidth}px` }}
    className="relative bg-[#252526] border-r border-gray-700 flex-shrink-0 transition-all duration-300 overflow-hidden"
>

{

    isExplorerCollapsed ? (

        <button
            onClick={toggleExplorer}
            className="w-full h-full bg-[#252526] hover:bg-[#333] text-white"
        >
            ▶
        </button>

    ) : (

        <>

            <button
                className="w-full bg-blue-600 py-2"
                onClick={onCreateFiles}
            >
                Create Files
            </button>

            <button
                onClick={toggleExplorer}
                className="absolute top-2 right-2 p-1"
            >
                ◀
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

        </>

    )

}

        </div>

    );

};

export default ExplorerPanel;