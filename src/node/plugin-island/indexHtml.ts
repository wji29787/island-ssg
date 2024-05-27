import { readFile } from 'fs/promises'
import { Plugin } from 'vite'
import { PACKAGE_ROOT,DEFAULT_HTML_PATH ,CLIENT_ENTRY_PATH} from  '../constans'

export function pluginIndexHtml (): Plugin {


      return {
        name:'island:index-html',
        apply:'serve',
        transformIndexHtml(html){
          console.log('transformIndexHtm----',CLIENT_ENTRY_PATH)
          return {
            html,
            tags:[
                {
                    tag:'script',
                    attrs:{
                        type:'module',
                        src:`/@fs/${CLIENT_ENTRY_PATH}`
                    },
                    injectTo:"body"
                }
            ]
          }
        },
        configureServer(serve){
            return ()=>{
               serve.middlewares.use(async(req,res,next)=>{
                 let html = await readFile(DEFAULT_HTML_PATH,"utf-8");

                 try {
                    html = await serve.transformIndexHtml(req.url,html,req.originalUrl);

                    res.statusCode =200;
                    res.setHeader('Content-Type','text/html')
                    res.end(html)
                 }catch (e){
                     return next(e)
                 }

               })
            }
        }
      }
}