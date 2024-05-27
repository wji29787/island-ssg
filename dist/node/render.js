"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPage = void 0;
const fs = require("fs-extra");
const path_1 = require("path");
async function renderPage(render, root, clientBundle) {
    const clientChunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry);
    console.log(`Rendering page in server side...`);
    const appHtml = render();
    const html = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
    await fs.ensureDir((0, path_1.join)(root, 'build'));
    await fs.writeFile((0, path_1.join)(root, 'build/index.html'), html);
    await fs.remove((0, path_1.join)(root, '.temp'));
}
exports.renderPage = renderPage;
