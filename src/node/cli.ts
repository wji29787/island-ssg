import { cac }  from 'cac';
import { createDevServer } from './dev'
import { build } from './build'
import { resolve } from 'path';

const version = require('../../package.json').version;
const cli = cac('islend').version(version).help();


cli.command('[root]',"start dev server")
.alias('dev')
.action(async(root:string)=>{
 
   root = root? resolve(root):process.cwd();
   console.log('dev----',root)
   const server = await createDevServer(root);
   await server.listen();
   server.printUrls();
});
cli.command("build [root]","build for production")
.action(async(root:string)=>{
    console.log('build',root)
    try {
        root = resolve(root);
        await build(root)

    } catch(e){
      console.log(e)
    }

})
cli.parse();