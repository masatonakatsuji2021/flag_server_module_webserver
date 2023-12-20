import Util from "@flagfw/flag/bin/Util";
import * as fs from "fs";
import * as querystring from "querystring";

export default class _{

    public static async sandbox(scString: string, option, send : any){

        let ___output___ = "";

        if(!send){
            send = {};
        }

        try{

            const echob64 = (string : string)=>{
                ___output___ += Util.base64Decode(string);
            };

            const echo = (text : string | Promise<unknown>)=>{
                if(text instanceof Promise){
                    text.then((res)=>{
                        if(res){
                            ___output___ += res;
                        }
                    });
                }
                else{
                    if(text){
                        ___output___ += text;
                    }
                }
            };

            const debug = (data : any) =>{

                if(data === null){
                    data = "null";
                }

                if(data === undefined){
                    data = "undefined";
                }
                
                if(typeof data == "object"){
                    if(Array.isArray(data)){
                        ___output___ += "<div><pre><code>[" + data.toString() + "]</code></pre></div>";
                    }
                    else{

                        const __debug = (data, num? : number)=>{
                            let str = "\n";
                            if(!num){
                                num = 0;
                            }
                            const indent = num + 2;
                            let indentStr = "";
                            for(let n = 0 ; n < indent ; n++){
                                indentStr += " ";
                            }
                            const c = Object.keys(data);
                            let maxLength = 0;
                            for(let n = 0 ; n < c.length ; n++){
                                const name = c[n];
                                if(maxLength < name.length){
                                    maxLength = name.length;
                                }
                            }

                            for(let n = 0 ; n < c.length ; n++){
                                const name = c[n];
                                const value =data[name];

                                if(typeof value == "object"){
                                    str += indentStr + name.padStart(maxLength + 2) + ": [" + __debug(value, indent + maxLength + 2);
                                    str += indentStr + "".padStart(maxLength + 4) + "]\n";
                                }
                                else{
                                    if(typeof value == "string"){
                                        str += indentStr + name.padStart(maxLength + 2) + ": \"" + value.toString() + "\"\n";
                                    }
                                    else{
                                        str += indentStr + name.padStart(maxLength + 2) + ": " + value.toString() + "\n";
                                    }
                                }
                            }
                            return str;
                        };

                        ___output___ += "<div><pre><code>[" + __debug(data) + "]</code></pre></div>";
                    }

                }
                else{
                    ___output___ += "<div><pre><code>" + data.toString() + "</code></pre></div>";
                }

            };

            const getQuery = ()=>{
                if(!option.req){
                    return;
                }

                const queryBuff = option.req.url.split("?")[1];

                if(!queryBuff){
                    return;
                }

                let query = querystring.parse(queryBuff);

                return query;
            };

            const getBody = () => {

                return new Promise((resolve)=> {
                    if(!option.req){
                        return;
                    }
                    let dataStr = "";
                    option.req.on("data", (d_) => {
                        dataStr += d_;
                    });
    
                    option.req.on("end", () => {
                        // @ts-ignore
                        const contentType = option.req.headers["content-type"];

                        if(!contentType){
                            return resolve(null);
                        }

                        let data = null;
                        if(contentType == "application/x-www-form-urlencoded"){
                            data = querystring.parse(dataStr);
                            const c = Object.keys(data);
                            for(let n = 0 ; n < c.length ; n++){
                                const key = c[n];
                                let val = data[key];
                                val = decodeURIComponent(val);
                                data[key] = val;
                            }
                        }
                        else if(contentType.indexOf("multipart/form-data") === 0){
                            let data = {};
                            const boundary = contentType.split("boundary=")[1];
                            const dataBuffer = dataStr.split(boundary);
                            for(let n = 0 ; n < dataBuffer.length ; n++){
                                const db_ = dataBuffer[n];

                                if(db_.indexOf("--") === 0){
                                    continue;
                                }

                                const databuffer2 = db_.split("\r\n");

                                let value = null;
                                let name = null;
                                for(let n2 = 0 ; n2< databuffer2.length ; n2++){
                                    const db2_ = databuffer2[n2];

                                    if(!db2_ || db2_ == "--"){
                                        continue;
                                    }

                                    if(db2_.indexOf("name=\"") > -1){
                                        name = db2_.split("name=\"")[1].split("\"").join("");
                                    }
                                    else{
                                        value = db2_;
                                    }
                                }

                                data[name] = value;
                            }

                            console.log(data);
                        }
                        else if(contentType == "text/plain"){
                            data = querystring.parse(dataStr);
                        }

                        resolve(data);
                    });
                });
            };

            const load = async (filePath : string, sendData?)=>{
                let fullPath = filePath;
                if(option.rootDir){
                    fullPath = option.rootDir + "/" + filePath;
                }
                fullPath = fullPath.split("//").join("/");
                if(!fs.existsSync(fullPath)){
                    throw Error("no such found \"" + filePath + "\".");
                }
                const result = await option.context.loadFile(fullPath, option, sendData);
                echo(result);
            };

            const sleep = (timeout : number) : Promise<Boolean> =>{
                return new Promise((resolve)=>{
                    setTimeout(()=>{
                        resolve(true);
                    }, timeout);
                });
            };

            await eval("(async () => {" + scString + "})();");
        }catch(err){
            console.log(err);
            if(option.outError){
                let errStr = err;
                if(option.errorFormat){
                    errStr = option.errorFormat.replace("{error}", err);
                }
                ___output___ += "[ERROR] " + errStr;
            }
        }

        return ___output___;
    }

}