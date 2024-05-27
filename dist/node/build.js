"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.bundle = void 0;
const vite_1 = require("vite");
const path_1 = require("path");
const render_1 = require("./render");
const constans_1 = require("./constans");
// import { pluginIndexHtml } from './plugin-island/indexHtml'
const plugin_react_1 = require("@vitejs/plugin-react");
async function bundle(root) {
    const resolveViteConfig = (isServer) => {
        return {
            mode: 'production',
            root,
            plugins: [(0, plugin_react_1.default)()],
            build: {
                ssr: isServer,
                outDir: isServer ? '.temp' : 'build',
                rollupOptions: {
                    input: isServer ? constans_1.SERVER_ENTRY_PATH : constans_1.CLIENT_ENTRY_PATH,
                    output: {
                        format: isServer ? 'cjs' : 'esm'
                    }
                }
            }
        };
    };
    console.log(`Building client + server bundles...`);
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            (0, vite_1.build)(resolveViteConfig(false)),
            (0, vite_1.build)(resolveViteConfig(true))
        ]);
        return [clientBundle, serverBundle];
    }
    catch (err) {
        console.log(err);
    }
}
exports.bundle = bundle;
async function build(root = process.cwd()) {
    const [clientBundle, serverBundle] = await bundle(root);
    // ssr 入口
    const serverEntryPath = (0, path_1.join)(root, '.temp', 'ssr-entry.js');
    const { render } = require(serverEntryPath);
    await (0, render_1.renderPage)(render, root, clientBundle);
}
exports.build = build;
