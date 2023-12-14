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
class _ {
    static sandbox(scString, option) {
        return __awaiter(this, void 0, void 0, function* () {
            let ___output___ = "";
            try {
                const echob64 = (string) => {
                    ___output___ += Util_1.default.base64Decode(string);
                };
                const echo = (text) => {
                    if (text instanceof Promise) {
                        text.then((res) => {
                            ___output___ += res;
                        });
                    }
                    else {
                        ___output___ += text;
                    }
                };
                const load = (filePath) => __awaiter(this, void 0, void 0, function* () {
                    let fullPath = filePath;
                    if (option.rootDir) {
                        fullPath = option.rootDir + "/" + filePath;
                    }
                    fullPath = fullPath.split("//").join("/");
                    const result = yield option.context.loadFile(fullPath, option);
                    echo(result);
                });
                yield eval("(async () => {" + scString + "})();");
            }
            catch (err) {
                console.log(err);
            }
            return ___output___;
        });
    }
}
exports.default = _;
