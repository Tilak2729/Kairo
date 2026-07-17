const getFileIcon = (filename) => {
    if (filename.endsWith(".html")) return "ri-html5-line text-[#e34c26]";
    if (filename.endsWith(".css")) return "ri-css3-line text-[#3794ff]";
    if (filename.endsWith(".js") || filename.endsWith(".jsx")) return "ri-javascript-line text-[#e8c547]";
    if (filename.endsWith(".json")) return "ri-braces-line text-[#e8c547]";
    return "ri-file-line text-[#858585]";
};

const ExplorerPanel = ({
    fileTree,
    currentFile,
    onCreateFiles,
    explorerWidth,
    isExplorerCollapsed,
    toggleExplorer,
    handleFileOpen,
}) => {

    return (

<div
    style={{ width: `${explorerWidth}px` }}
    className="relative bg-[#252526] border-r border-[#2d2d2d] flex-shrink-0 transition-all duration-300 overflow-hidden"
>

{

    isExplorerCollapsed ? (

        <button
            onClick={toggleExplorer}
            title="Show explorer"
            className="w-full h-full bg-[#252526] hover:bg-[#2a2d2e] text-[#858585] hover:text-[#cccccc] transition-colors duration-100 flex items-start justify-center pt-3"
        >
            <i className="ri-arrow-right-s-line text-base"></i>
        </button>

    ) : (

        <>

            <div className="flex items-center justify-between h-9 px-3 border-b border-[#2d2d2d]">

                <span className="text-[11px] font-semibold tracking-wider text-[#858585] uppercase">
                    Explorer
                </span>

                <button
                    onClick={toggleExplorer}
                    title="Hide explorer"
                    className="p-1 rounded-sm text-[#858585] hover:text-[#cccccc] hover:bg-[#3c3c3c] transition-colors duration-100"
                >
                    <i className="ri-arrow-left-s-line text-base"></i>
                </button>

            </div>

            <button
                className="w-full flex items-center justify-center gap-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-[13px] font-medium py-2 transition-colors duration-100"
                onClick={onCreateFiles}
            >
                <i className="ri-file-add-line text-sm"></i>
                Create Files
            </button>

            <div className="py-1">

                {

                    Object.keys(fileTree).map(file => (

                        <div
                            key={file}
                            onClick={() =>  handleFileOpen(file) }
                            className={`group flex items-center gap-2 pl-3 pr-2 py-1.5 cursor-pointer border-l-2 text-[13px] transition-colors duration-100
                            ${
                                currentFile === file
                                    ? "bg-[#37373d] border-[#3794ff] text-white"
                                    : "border-transparent text-[#cccccc]/85 hover:bg-[#2a2d2e]"
                            }`}
                        >
                            <i className={`${getFileIcon(file)} text-sm shrink-0`}></i>
                            <span className="truncate">{file}</span>
                        </div>

                    ))

                }

            </div>

        </>

    )

}

        </div>

    );

};

export default ExplorerPanel;