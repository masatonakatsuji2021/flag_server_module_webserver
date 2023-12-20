"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (output, text) => {
    if (text instanceof Promise) {
        text.then((res) => {
            if (res) {
                output += res;
            }
        });
    }
    else {
        if (text) {
            output += text;
        }
    }
    return output;
};
