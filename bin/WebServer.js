"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Mimes_1 = require("./Mimes");
const Elf_1 = require("./Elf");
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
    static notFound(result, mdata, server) {
        result.res.writeHead(404);
        let coutent = "";
        if (WebServer.errorPageBuffer) {
            coutent = WebServer.errorPageBuffer;
        }
        else {
            let notFoundPath;
            if (mdata.notFound) {
                notFoundPath = server.rootDir + "/" + mdata.notFound;
            }
            else {
                notFoundPath = path.dirname(__dirname) + "/htdocs/notfound.html";
            }
            notFoundPath = notFoundPath.split("//").join("/");
            coutent = fs.readFileSync(notFoundPath).toString();
            WebServer.errorPageBuffer = coutent;
        }
        result.res.write(coutent);
        result.res.end();
    }
    static listen(result, moduleData, server) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!moduleData) {
                return;
            }
            for (let n = 0; n < moduleData.length; n++) {
                const m_ = moduleData[n];
                if (!m_.indexed) {
                    m_.indexed = [];
                }
                let targetRoot;
                let targetPath = "";
                if (m_.rootDir.indexOf("./") === 0) {
                    targetRoot = server.rootDir + m_.rootDir.substring(1);
                }
                else {
                    targetRoot = server.rootDir;
                }
                let url = result.req.url;
                url = url.split("?")[0];
                targetPath = targetRoot + "/" + url;
                targetPath = targetPath.split("//").join("/");
                let exists = false;
                if (targetPath.substring(targetPath.length - 1) === "/") {
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
                if (!exists) {
                    return WebServer.notFound(result, m_, server);
                }
                const mime = WebServer.getMime(targetPath);
                let contents = fs.readFileSync(targetPath);
                let headers = {};
                headers["content-type"] = mime;
                if (m_.cache) {
                    let juge = true;
                    let cache = "";
                    if (m_.cache.ignore) {
                        for (let n2 = 0; n2 < m_.cache.ignore.length; n2++) {
                            const target = m_.cache.ignore[n2];
                            if (path.basename(targetPath) === target) {
                                juge = false;
                                break;
                            }
                            if (path.extname(targetPath) === ("." + target)) {
                                juge = false;
                                break;
                            }
                        }
                    }
                    if (juge) {
                        if (m_.cache.max) {
                            cache = "max-age=" + m_.cache.max;
                        }
                        headers["cache-control"] = cache;
                    }
                }
                result.res.writeHead(200, headers);
                if (m_.elf) {
                    if (path.extname(targetPath) == ".elf") {
                        let ec_;
                        let eopt = {};
                        if (typeof m_.elf == "boolean") {
                            eopt = {};
                        }
                        else {
                            eopt = m_.elf;
                        }
                        // @ts-ignore
                        eopt.req = result.req;
                        // @ts-ignore
                        eopt.res = result.res;
                        // @ts-ignore
                        eopt.rootDir = targetRoot;
                        // @ts-ignore
                        if (eopt.outError) {
                            // @ts-ignore
                            eopt.errorFormat = "<p style=\"font-weight:bold\">{error}</p>";
                        }
                        ec_ = yield Elf_1.default.convert(contents.toString(), eopt);
                        contents = Buffer.from(ec_);
                    }
                }
                result.res.write(contents);
                result.res.end();
            }
        });
    }
}
WebServer.errorPageBuffer = "";
exports.default = WebServer;
