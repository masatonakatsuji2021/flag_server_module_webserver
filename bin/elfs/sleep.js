"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, timeout);
    });
};
