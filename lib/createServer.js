import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import createLang from './createLang.js';
import line from './getLine.js';

const lang = createLang({
    browse:{
        cn:'服务启动成功',
        en:'Service started successfully'
    }
});

const createServer = (dir, port) => {
    const server = http.createServer((request, response)=>{
        const filePath = `${dir}${request.url === "/" ? request.url+'index.html' : request.url}`;
        // console.log("路径",filePath);
        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm',
        };
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        fs.readFile(filePath, (error, content)=>{
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', (error, content)=>{
                        response.writeHead(404, {
                            'Content-Type': 'text/html'
                        });
                        response.end(content, 'utf-8');
                    });
                } else {
                    response.writeHead(500);
                    response.end(
                        'Sorry, check with the site admin for error: ' + error.code + ' ..\n',
                    );
                    response.end();
                }
            } else {
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.end(content, 'utf-8');
            }
        });
    });

    server.listen(port, ()=>{
        console.log(line);
        console.log(`${lang('browse')} http://localhost:${port}`);
    });
}

export default createServer;