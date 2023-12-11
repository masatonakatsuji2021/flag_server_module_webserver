"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Mimes_1 = require("./Mimes");
class WebServer {
    static getMime(filePath) {
        let ext = path.extname(filePath);
        ext = ext.split(".").join("");
        let mime = "text/plain";
        if (Mimes_1.default[ext]) {
            mime = Mimes_1.default[ext];
        }
        return mime;
    }
    static listen(result, moduleData, server) {
        if (!moduleData) {
            return;
        }
        for (let n = 0; n < moduleData.length; n++) {
            const m_ = moduleData[n];
            if (!m_.indexed) {
                m_.indexed = [];
            }
            let targetPath = "";
            if (m_.rootDir.indexOf("./") === 0) {
                targetPath = server.rootDir + m_.rootDir.substring(1) + "/" + result.req.url;
            }
            else {
                targetPath = m_.rootDir + "/" + result.req.url;
            }
            targetPath = targetPath.split("//").join("/");
            let exists = false;
            if (targetPath.substring(targetPath.length - 1) === "/") {
                for (let n = 0; n < m_.indexed.length; n++) {
                    const fname = m_.indexed[n];
                    const checkPath = targetPath + fname;
                    if (fs.existsSync(checkPath)) {
                        console.log("exiets!!");
                        targetPath = checkPath;
                        exists = true;
                    }
                }
            }
            else {
                if (fs.existsSync(targetPath)) {
                    exists = true;
                }
            }
            if (!exists) {
                result.res.writeHead(404);
                result.res.write("404 Not Found");
                result.res.end();
                return;
            }
            const mime = WebServer.getMime(targetPath);
            const contents = fs.readFileSync(targetPath);
            result.res.writeHead(200, {
                mimeType: mime,
            });
            result.res.write(contents);
            result.res.end();
        }
    }
}
exports.default = WebServer;
