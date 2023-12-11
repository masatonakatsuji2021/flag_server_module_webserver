"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class WebServer {
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
                targetPath += "index.html";
                for (let n = 0; n < m_.indexed.length; n++) {
                    const fname = m_.indexed[n];
                    const checkPath = targetPath + fname;
                    if (fs.existsSync(checkPath)) {
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
            console.log(targetPath);
        }
    }
}
exports.default = WebServer;
