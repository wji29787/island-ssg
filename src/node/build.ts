import { build as viteBuild ,InlineConfig,Rollup} from 'vite';
import { join } from 'path';
import { pathToFileURL ,fileURLToPath} from 'url';
import { renderPage } from './render'

import { CLIENT_ENTRY_PATH ,SERVER_ENTRY_PATH} from './constans'
// import { pluginIndexHtml } from './plugin-island/indexHtml'
import  pluginReact from '@vitejs/plugin-react'

export async function bundle (root:string){

    const resolveViteConfig = (isServer:boolean):InlineConfig=>{
          return {
            mode:'production',
            root,
            plugins:[pluginReact()],
            build:{
                ssr:isServer,
                outDir: isServer? '.temp': 'build',
                rollupOptions:{
                    input: isServer? SERVER_ENTRY_PATH: CLIENT_ENTRY_PATH,
                    output:{
                        format: isServer? 'cjs':'esm'
                    }
                }
            }

          }
    }
    console.log(`Building client + server bundles...`);
      try {

        const [clientBundle,serverBundle] = await Promise.all([
            viteBuild(resolveViteConfig(false)),
            viteBuild(resolveViteConfig(true))
        ])
        return [clientBundle,serverBundle] as [Rollup.RollupOutput,Rollup.RollupOutput ]
      }
      catch (err){
         console.log(err)
      }
}




export  async function build(root:string = process.cwd()){
    const [ clientBundle,serverBundle ] =   await bundle(root);
    // ssr 入口
    const serverEntryPath = join(root,'.temp','ssr-entry.js');
    // console.log('serverEntryPath1---',serverEntryPath)
    // console.log('serverEntryPath----',pathToFileURL(serverEntryPath))

    const { render } = (await import(pathToFileURL(serverEntryPath).pathname));
    // console.log('render---',typeof render)
    await renderPage(render,root,clientBundle)
}


