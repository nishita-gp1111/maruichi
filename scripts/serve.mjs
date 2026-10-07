import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const port=Number(process.env.PORT||3022);
const basePath='/maruichi/';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  try{
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(path==='/'||path===basePath.slice(0,-1)){
      res.writeHead(302,{Location:basePath});res.end();return;
    }
    if(!path.startsWith(basePath))throw new Error('invalid path');
    let file=resolve(root,path.slice(basePath.length));
    if(file!==root&&!file.startsWith(root+sep))throw new Error('invalid path');
    if((await stat(file)).isDirectory()){
      if(!path.endsWith('/')){res.writeHead(302,{Location:path+'/'});res.end();return;}
      file=resolve(file,'index.html');
    }
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(file));
  }catch{
    res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('ページが見つかりません。');
  }
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}${basePath}`));
