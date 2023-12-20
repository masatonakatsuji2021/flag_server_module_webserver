"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (output, data) => {
    if (data === null) {
        data = "null";
    }
    if (data === undefined) {
        data = "undefined";
    }
    if (typeof data == "object") {
        if (Array.isArray(data)) {
            output += "<div><pre><code>[" + data.toString() + "]</code></pre></div>";
        }
        else {
            const __debug = (data, num) => {
                let str = "\n";
                if (!num) {
                    num = 0;
                }
                const indent = num + 2;
                let indentStr = "";
                for (let n = 0; n < indent; n++) {
                    indentStr += " ";
                }
                const c = Object.keys(data);
                let maxLength = 0;
                for (let n = 0; n < c.length; n++) {
                    const name = c[n];
                    if (maxLength < name.length) {
                        maxLength = name.length;
                    }
                }
                for (let n = 0; n < c.length; n++) {
                    const name = c[n];
                    const value = data[name];
                    if (typeof value == "object") {
                        str += indentStr + name.padStart(maxLength + 2) + ": [" + __debug(value, indent + maxLength + 2);
                        str += indentStr + "".padStart(maxLength + 4) + "]\n";
                    }
                    else {
                        if (typeof value == "string") {
                            str += indentStr + name.padStart(maxLength + 2) + ": \"" + value.toString() + "\"\n";
                        }
                        else {
                            str += indentStr + name.padStart(maxLength + 2) + ": " + value.toString() + "\n";
                        }
                    }
                }
                return str;
            };
            output += "<div><pre><code>[" + __debug(data) + "]</code></pre></div>";
        }
    }
    else {
        output += "<div><pre><code>" + data.toString() + "</code></pre></div>";
    }
    return output;
};
