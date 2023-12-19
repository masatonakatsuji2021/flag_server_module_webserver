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
const Util_1 = require("@flagfw/flag/bin/Util");
const fs = require("fs");
const querystring = require("querystring");
class _ {
    static sandbox(scString, option, send) {
        return __awaiter(this, void 0, void 0, function* () {
            let ___output___ = "";
            if (!send) {
                send = {};
            }
            try {
                const echob64 = (string) => {
                    ___output___ += Util_1.default.base64Decode(string);
                };
                const echo = (text) => {
                    if (text instanceof Promise) {
                        text.then((res) => {
                            if (res) {
                                ___output___ += res;
                            }
                        });
                    }
                    else {
                        if (text) {
                            ___output___ += text;
                        }
                    }
                };
                const getQuery = () => {
                    if (!option.req) {
                        return;
                    }
                    const queryBuff = option.req.url.split("?")[1];
                    if (!queryBuff) {
                        return;
                    }
                    let query = querystring.parse(queryBuff);
                    return query;
                };
                const getPost = () => {
                    return new Promise((resolve) => {
                        if (!option.req) {
                            return;
                        }
                        let dataStr = "";
                        option.req.on("data", (d_) => {
                            dataStr += d_;
                        });
                        option.req.on("end", () => {
                            // @ts-ignore
                            const contentTYpe = option.req.headers["content-type"];
                            let data = null;
                            if (contentTYpe == "application/x-www-form-urlencoded") {
                                console.log(dataStr);
                                data = querystring.parse(dataStr);
                                const c = Object.keys(data);
                                for (let n = 0; n < c.length; n++) {
                                    const key = c[n];
                                    let val = data[key];
                                    val = decodeURIComponent(val);
                                    data[key] = val;
                                }
                            }
                            else if (contentTYpe == "multipart/form-data") {
                            }
                            else if (contentTYpe == "text/plain") {
                                data = querystring.parse(dataStr);
                            }
                            resolve(data);
                        });
                    });
                };
                const load = (filePath, sendData) => __awaiter(this, void 0, void 0, function* () {
                    let fullPath = filePath;
                    if (option.rootDir) {
                        fullPath = option.rootDir + "/" + filePath;
                    }
                    fullPath = fullPath.split("//").join("/");
                    if (!fs.existsSync(fullPath)) {
                        throw Error("no such found \"" + filePath + "\".");
                    }
                    const result = yield option.context.loadFile(fullPath, option, sendData);
                    echo(result);
                });
                const sleep = (timeout) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        }, timeout);
                    });
                };
                yield eval("(async () => {" + scString + "})();");
            }
            catch (err) {
                console.log(err);
                if (option.outError) {
                    let errStr = err;
                    if (option.errorFormat) {
                        errStr = option.errorFormat.replace("{error}", err);
                    }
                    ___output___ += "[ERROR] " + errStr;
                }
            }
            return ___output___;
        });
    }
}
exports.default = _;
