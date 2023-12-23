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
const echo_1 = require("./elfs/echo");
const debug_1 = require("./elfs/debug");
const GetQuery_1 = require("@flagfw/server/bin/common/GetQuery");
const GetBody_1 = require("@flagfw/server/bin/common/GetBody");
const Cookie_1 = require("@flagfw/server/bin/common/Cookie");
const Session_1 = require("@flagfw/server/bin/common/Session");
const load_1 = require("./elfs/load");
const sleep_1 = require("./elfs/sleep");
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
                    ___output___ = (0, echo_1.default)(___output___, text);
                };
                const debug = (data) => {
                    ___output___ = (0, debug_1.default)(___output___, data);
                };
                const getQuery = () => {
                    return (0, GetQuery_1.default)(option);
                };
                const getBody = () => {
                    return (0, GetBody_1.default)(option);
                };
                const load = (filePath, sendData) => __awaiter(this, void 0, void 0, function* () {
                    ___output___ = yield (0, load_1.default)(___output___, filePath, sendData, option);
                });
                const sleep = (timeout) => {
                    return (0, sleep_1.default)(timeout);
                };
                let cookie = null;
                let session = null;
                if (option.req && option.res) {
                    if (option.req.cookie) {
                        cookie = option.req.cookie;
                    }
                    else {
                        cookie = new Cookie_1.default(option.req, option.res);
                        option.req.cookie = cookie;
                    }
                    if (option.req.session) {
                        session = option.req.session;
                    }
                    else {
                        session = new Session_1.default(option.req, option.res);
                        session.writePath = option.mostRootDir + "/.sessions";
                        option.req.session = session;
                    }
                }
                require = null;
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
