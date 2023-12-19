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

            const getPost = () => {

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
                        const contentTYpe = option.req.headers["content-type"];

                        let data = null;
                        if(contentTYpe == "application/x-www-form-urlencoded"){
                            console.log(dataStr);
                            data = querystring.parse(dataStr);
                            const c = Object.keys(data);
                            for(let n = 0 ; n < c.length ; n++){
                                const key = c[n];
                                let val = data[key];
                                val = decodeURIComponent(val);
                                data[key] = val;
                            }
                        }
                        else if(contentTYpe == "multipart/form-data"){

                        }
                        else if(contentTYpe == "text/plain"){
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