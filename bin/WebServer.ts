import * as path from "path";
import * as fs from "fs";
import Mimes from "./Mimes";
import Elf from "./Elf";

export default class WebServer{

    private static errorPageBuffer : string = "";

    private static getMime(filePath : string) : string{
        let ext = path.extname(filePath)
        ext = ext.split(".").join("");

        let mime = "text/plain";
        if(Mimes[ext]){
            mime = Mimes[ext];
        }

        return mime;
    }

    private static notFound(result, mdata, server){
        result.res.writeHead(404);

        let coutent : string = "";
        if(WebServer.errorPageBuffer){
            coutent = WebServer.errorPageBuffer;
        }
        else{
            let notFoundPath : string;

            if(mdata.notFound){
                notFoundPath = server.rootDir + "/" + mdata.notFound;
            }
            else{
                notFoundPath = path.dirname(__dirname) + "/htdocs/notfound.html";
            }

            notFoundPath = notFoundPath.split("//").join("/");

            coutent = fs.readFileSync(notFoundPath).toString();
            WebServer.errorPageBuffer = coutent;            
        }

        result.res.write(coutent);
        result.res.end();
    }

    public static async listen(result, moduleData, server){
        if(!moduleData){
            return;
        }

        for(let n = 0 ; n < moduleData.length ; n++){
            const m_ = moduleData[n];

            if(!m_.indexed){
                m_.indexed = [];
            }

            let targetRoot : string;
            let targetPath : string = "";
            if(m_.rootDir.indexOf("./") === 0){
                targetRoot = server.rootDir + m_.rootDir.substring(1);
            }
            else{
                targetRoot = server.rootDir;
            }
            let url = result.req.url;
            url = url.split("?")[0];
            targetPath = targetRoot + "/" + url;

            targetPath = targetPath.split("//").join("/");

            let exists = false;
            if(targetPath.substring(targetPath.length - 1) === "/"){           
                for(let n = 0 ; n < m_.indexed.length ; n++){
                    const fname = m_.indexed[n];
                    const checkPath = targetPath + fname;
                    
                    if(fs.existsSync(checkPath)){
                        targetPath = checkPath;
                        exists = true;
                    }
                }
            }
            else{
                if(fs.existsSync(targetPath)){
                    exists = true;
                }
            }

            if(!exists){                
                return WebServer.notFound(result, m_, server);
            }

            const mime = WebServer.getMime(targetPath);

            let contents = fs.readFileSync(targetPath);
            let headers = {};
            headers["content-type"] = mime;

            if(m_.cache){
                let juge = true;
                let cache = "";
                if(m_.cache.ignore){
                    for(let n2 = 0; n2 < m_.cache.ignore.length ; n2++){
                        const target = m_.cache.ignore[n2];

                        if(path.basename(targetPath) === target){
                            juge = false;
                            break;
                        }

                        if(path.extname(targetPath) === ("." + target)){
                            juge = false;
                            break;
                        }
                    }
                }
                if(juge){
                    if(m_.cache.max){
                        cache = "max-age=" + m_.cache.max;
                    }
                    headers["cache-control"] = cache;
                }
            }

            const c2 = Object.keys(headers);
            for(let n2 = 0 ; n2 < c2.length ; n2++){
                const key2 = c2[n2];
                const val2 = headers[key2];
                result.res.setHeader(key2, val2);
            }
            result.res.statusCode = 200;
//            result.res.writeHead(200, headers);

            if(m_.elf){
                if(path.extname(targetPath) == ".elf"){
                    let ec_ : string;
                    let eopt = {};
                    if(typeof m_.elf == "boolean"){
                        eopt = {};
                    }
                    else{
                        eopt = m_.elf;
                    }
                    // @ts-ignore
                    eopt.req = result.req;
                    // @ts-ignore
                    eopt.res = result.res;
                    // @ts-ignore
                    eopt.rootDir = targetRoot;
                    // @ts-ignore
                    eopt.mostRootDir = server.rootDir;
                    // @ts-ignore
                    if(eopt.outError){
                        // @ts-ignore
                        eopt.errorFormat = "<p style=\"font-weight:bold\">{error}</p>";
                    }
                    ec_ = await Elf.convert(contents.toString(), eopt);
                    contents = Buffer.from(ec_);
                }
            }

            result.res.write(contents);
            result.res.end();
        }
    }
}