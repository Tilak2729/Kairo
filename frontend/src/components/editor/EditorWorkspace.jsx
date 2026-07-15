import Divider from "../layout/Divider";
import ExplorerPanel from "./ExplorerPanel";
import CodeEditor from "./CodeEditor";

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

        <section className="flex flex-col flex-1 h-full bg-[#1e1e1e] text-white">

            {/* Header */}

            <div className="p-4 border-b border-gray-700">

                <h2 className="text-lg font-semibold">
                    Code Editor
                </h2>

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