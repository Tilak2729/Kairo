import Divider from "../layout/Divider";
import ExplorerPanel from "./ExplorerPanel";
import CodeEditor from "./CodeEditor";

const getFileIcon = (filename) => {
    if (!filename) return "ri-file-line text-[#858585]";
    if (filename.endsWith(".html")) return "ri-html5-line text-[#e34c26]";
    if (filename.endsWith(".css")) return "ri-css3-line text-[#3794ff]";
    if (filename.endsWith(".js") || filename.endsWith(".jsx")) return "ri-javascript-line text-[#e8c547]";
    if (filename.endsWith(".json")) return "ri-braces-line text-[#e8c547]";
    return "ri-file-line text-[#858585]";
};

const EditorWorkspace = ({
    fileTree,
    setFileTree,
    currentFile,
    setCurrentFile,
    saveTimeout,
    isRemoteUpdate,
    sendFileUpdate,
    onCreateFiles,
     explorerWidth,
     startExplorerResize,
     isExplorerCollapsed,
    toggleExplorer,
}) => {

    return (

        <section className="flex flex-col flex-1 h-full bg-[#1e1e1e] text-[#cccccc]">

            {/* Tab bar */}

            <div className="flex items-center h-9 border-b border-[#2d2d2d] bg-[#252526]">

                {
                    currentFile ? (

                        <div className="flex items-center gap-2 h-full px-3 bg-[#1e1e1e] border-r border-[#2d2d2d] border-t-2 border-t-[#3794ff] text-[13px]">
                            <i className={`${getFileIcon(currentFile)} text-sm`}></i>
                            <span>{currentFile}</span>
                        </div>

                    ) : (

                        <div className="px-3 text-[13px] text-[#858585]">
                            No file open
                        </div>

                    )
                }

            </div>

            {/* Workspace */}

            <div className="flex flex-1 overflow-hidden">

<ExplorerPanel
    fileTree={fileTree}
    currentFile={currentFile}
    setCurrentFile={setCurrentFile}
    onCreateFiles={onCreateFiles}
    explorerWidth={explorerWidth}
    isExplorerCollapsed={isExplorerCollapsed}
    toggleExplorer={toggleExplorer}

/>

{
    !isExplorerCollapsed && (

        <Divider
            onMouseDown={startExplorerResize}
        />

    )
}

<CodeEditor
    fileTree={fileTree}
    setFileTree={setFileTree}
    currentFile={currentFile}
    saveTimeout={saveTimeout}
    isRemoteUpdate={isRemoteUpdate}
    sendFileUpdate={sendFileUpdate}
/>

            </div>

        </section>

    );

};

export default EditorWorkspace;