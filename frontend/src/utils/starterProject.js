export const starterProject = {
    "index.html": {
        file: {
            contents: `<!DOCTYPE html>
<html>
<head>
    <title>Hello</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>Hello World!</h1>

    <script src="script.js"></script>

</body>
</html>`
        }
    },

    "style.css": {
        file: {
            contents: `body{
    font-family: Arial, sans-serif;
}`
        }
    },

    "script.js": {
        file: {
            contents: `console.log("Hello World");`
        }
    }
};