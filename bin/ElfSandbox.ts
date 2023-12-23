import Util from "@flagfw/flag/bin/Util";
import methodEcho from "./elfs/echo";
import methodDebug from "./elfs/debug";
import methodGetQuery from "@flagfw/server/bin/common/GetQuery";
import methodGetBody from "@flagfw/server/bin/common/GetBody";
import Cookie from "@flagfw/server/bin/common/Cookie";
import Session from "@flagfw/server/bin/common/Session";

import methodLoad from "./elfs/load";
import methodSleep from "./elfs/sleep";

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
                ___output___ = methodEcho(___output___, text);
            };

            const debug = (data : any) =>{
                ___output___ = methodDebug(___output___, data);
            };

            const getQuery = ()=>{
                return methodGetQuery(option);
            };

            const getBody = () => {
                return methodGetBody(option);
            };

            const load = async (filePath : string, sendData?)=>{
                ___output___ = await methodLoad(___output___, filePath, sendData, option);
            };

            const sleep = (timeout : number) : Promise<Boolean> =>{
                return methodSleep(timeout);
            };

            let cookie = null;
            let session = null;
            if(option.req && option.res){
                if(option.req.cookie){
                    cookie = option.req.cookie;
                }
                else{
                    cookie = new Cookie(option.req, option.res);
                    option.req.cookie = cookie;
                }
                if(option.req.session){
                    session = option.req.session;
                }
                else{
                    session = new Session(option.req, option.res);
                    session.writePath = option.mostRootDir + "/.sessions";
                    option.req.session = session;
                }
            }

            require = null;

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