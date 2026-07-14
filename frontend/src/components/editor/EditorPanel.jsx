import Editor from "@monaco-editor/react";

const EditorPanel = ({
    fileTree,
    setFileTree,
    currentFile,
    setCurrentFile,
    saveTimeout,
    isRemoteUpdate,
    sendFileUpdate,
}) => {

    return (
        <section className="flex-1 bg-[#1e1e1e] text-white flex flex-col">

            <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">
                    Code Editor
                </h2>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* File Explorer */}

                <div className="w-56 bg-[#252526] border-r border-gray-700">

                    <button
                        className="w-full bg-blue-600 py-2"
                        onClick={() => {

                            setFileTree({

                                "index.html": {
                                    file: {
                                        contents:
                                            "<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello</h1>\n</body>\n</html>"
                                    }
                                },

                                "style.css": {
                                    file: {
                                        contents:
                                            "body{\nbackground:black;\ncolor:white;\n}"
                                    }
                                },

                                "script.js": {
                                    file: {
                                        contents:
                                            "console.log('Hello');"
                                    }
                                }

                            });

                            setCurrentFile("index.html");

                        }}
                    >
                        Create Files
                    </button>

                    {

                        Object.keys(fileTree).map(file => (

                            <div
                                key={file}
                                onClick={() => setCurrentFile(file)}
                                className={`p-3 cursor-pointer hover:bg-[#3e3e42]
                                ${currentFile === file ? "bg-[#37373d]" : ""}`}
                            >
                                {file}
                            </div>

                        ))

                    }

                </div>

                {/* Monaco */}

                <div className="flex-1">

                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={
                            currentFile?.endsWith(".html")
                                ? "html"
                                : currentFile?.endsWith(".css")
                                ? "css"
                                : "javascript"
                        }
                        value={
                            currentFile
                                ? fileTree[currentFile]?.file?.contents
                                : ""
                        }
                        onChange={(value) => {

                            if (!currentFile) return;

                            if (isRemoteUpdate.current) {

                                isRemoteUpdate.current = false;

                                return;

                            }

                            const updatedFileTree = {

                                ...fileTree,

                                [currentFile]: {

                                    ...fileTree[currentFile],

                                    file: {

                                        ...fileTree[currentFile].file,

                                        contents: value

                                    }

                                }

                            };

                            setFileTree(updatedFileTree);

                            if (saveTimeout.current) {
                                clearTimeout(saveTimeout.current);
                            }

                            saveTimeout.current = setTimeout(() => {

                                sendFileUpdate(updatedFileTree);

                                console.log("Auto Saved");

                            }, 1000);

                        }}
                    />

                </div>

            </div>

        </section>
    );

};

export default EditorPanel;