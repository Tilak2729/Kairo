const getFileIcon = (filename) => {
    if (filename.endsWith(".html")) {
        return "ri-html5-line text-[#e34c26]";
    }

    if (filename.endsWith(".css")) {
        return "ri-css3-line text-[#3794ff]";
    }

    if (filename.endsWith(".js") || filename.endsWith(".jsx")) {
        return "ri-javascript-line text-[#e8c547]";
    }

    if (filename.endsWith(".json")) {
        return "ri-braces-line text-[#e8c547]";
    }

    return "ri-file-line text-[#858585]";
};


const EditorTabs = ({
    openFiles,
    currentFile,
    setCurrentFile,
    handleCloseTab,
}) => {

    return (

        <div className="h-9 flex bg-[#181818] border-b border-[#2d2d2d] overflow-x-auto flex-shrink-0">

            {openFiles.map((file) => (

                <div
                    key={file}
                    onClick={() => setCurrentFile(file)}
                    className={`group flex items-center gap-2 px-3 min-w-fit border-r border-[#2d2d2d] cursor-pointer text-[13px] select-none
                    ${
                        currentFile === file
                            ? "bg-[#1e1e1e] text-white border-t border-t-[#3794ff]"
                            : "bg-[#181818] text-[#969696] hover:bg-[#1f1f1f]"
                    }`}
                >

                    <i
                        className={`${getFileIcon(file)} text-sm shrink-0`}
                    ></i>

                    <span>
                        {file}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTab(file);
                        }}
                        title={`Close ${file}`}
                        className="ml-1 w-5 h-5 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-[#3c3c3c] transition"
                    >
                        <i className="ri-close-line text-sm"></i>
                    </button>

                </div>

            ))}

        </div>

    );

};

export default EditorTabs;