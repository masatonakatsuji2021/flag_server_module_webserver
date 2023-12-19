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
const ElfSandbox_1 = require("./ElfSandbox");
const fs = require("fs");
/**
 * Embeded interpreter Frame
 */
class Elf {
    static convertEchob64(code) {
        return "echob64(\"" + Util_1.default.base64Encode(code) + "\");";
    }
    static loadFile(filePath, option, sendData) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = fs.readFileSync(filePath).toString();
            return yield Elf.convert(content, option, sendData);
        });
    }
    static convert(codeString, option, sendData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!option) {
                option = {};
            }
            const buffer1 = codeString.split(Elf.header);
            let decString = "";
            for (let n = 0; n < buffer1.length; n++) {
                const b_ = buffer1[n];
                if (n == 0) {
                    if (b_) {
                        decString += Elf.convertEchob64(b_);
                    }
                    continue;
                }
                const b2_ = b_.split(Elf.footer);
                decString += b2_[0];
                if (b2_[1]) {
                    decString += Elf.convertEchob64(b2_[1]);
                }
            }
            // @ts-ignore
            option.context = Elf;
            return yield ElfSandbox_1.default.sandbox(decString, option, sendData);
        });
    }
}
Elf.header = "<?";
Elf.footer = "?>";
exports.default = Elf;
