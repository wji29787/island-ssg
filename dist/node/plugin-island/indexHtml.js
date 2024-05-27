"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIndexHtml = void 0;
const promises_1 = require("fs/promises");
const constans_1 = require("../constans");
function pluginIndexHtml() {
    return {
        name: 'island:index-html',
        apply: 'serve',
        transformIndexHtml(html) {
            console.log('transformIndexHtm----', constans_1.CLIENT_ENTRY_PATH);
            return {
                html,
                tags: [
                    {
                        tag: 'script',
                        attrs: {
                            type: 'module',
                            src: `/@fs/${constans_1.CLIENT_ENTRY_PATH}`
                        },
                        injectTo: "body"
                    }
                ]
            };
        },
        configureServer(serve) {
            return () => {
                serve.middlewares.use(async (req, res, next) => {
                    let html = await (0, promises_1.readFile)(constans_1.DEFAULT_HTML_PATH, "utf-8");
                    try {
                        html = await serve.transformIndexHtml(req.url, html, req.originalUrl);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.end(html);
                    }
                    catch (e) {
                        return next(e);
                    }
                });
            };
        }
    };
}
exports.pluginIndexHtml = pluginIndexHtml;
