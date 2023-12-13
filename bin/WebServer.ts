import ServerUtil from "@flagfw/server/bin/common/Util";
import * as path from "path";
import * as fs from "fs";
import Mimes from "./Mimes";

export default class WebServer{
    
    public static pageCapacita = {};

    public static getMime(filePath : string){
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
        let coutent = "";
        if(mdata.notFound){
            let notfoundPath = server.rootDir + "/" + mdata.notFound;
            notfoundPath = notfoundPath.split("//").join("/");
            coutent = fs.readFileSync(notfoundPath).toString();
        }
        else{
            coutent = fs.readFileSync(path.dirname(__dirname) + "/htdocs/notfound.html").toString();
        }
        result.res.write(coutent);
        result.res.end();
    }

    public static listen(result, moduleData, server){
        if(!moduleData){
            return;
        }

        for(let n = 0 ; n < moduleData.length ; n++){
            const m_ = moduleData[n];

            if(!m_.indexed){
                m_.indexed = [];
            }

            let targetPath : string = "";
            if(m_.rootDir.indexOf("./") === 0){
                targetPath = server.rootDir + m_.rootDir.substring(1) + "/" + result.req.url;
            }
            else{
                targetPath = m_.rootDir + "/" + result.req.url;
            }

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

            if(m_.authority){
                

            }


            const mime = WebServer.getMime(targetPath);

            const contents = fs.readFileSync(targetPath);
            let headers = {};
            headers["mimeType"] = mime;

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

            result.res.writeHead(200, headers);
            result.res.write(contents);
            result.res.end();
        }
    }
}