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
const fs = require("fs");
exports.default = (output, filePath, sendData, option) => __awaiter(void 0, void 0, void 0, function* () {
    let fullPath = filePath;
    if (option.rootDir) {
        fullPath = option.rootDir + "/" + filePath;
    }
    fullPath = fullPath.split("//").join("/");
    if (!fs.existsSync(fullPath)) {
        throw Error("no such found \"" + filePath + "\".");
    }
    const result = yield option.context.loadFile(fullPath, option, sendData);
    output += result;
    return output;
});
