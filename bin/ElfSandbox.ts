import Util from "@flagfw/flag/bin/Util";

export default class _{

    public static async sandbox(scString: string, option){

        let ___output___ = "";

        try{

            const echob64 = (string : string)=>{
                ___output___ += Util.base64Decode(string);
            };

            const echo = (text : string | Promise<unknown>)=>{
                if(text instanceof Promise){
                    text.then((res)=>{
                        ___output___ += res;
                    });
                }
                else{
                    ___output___ += text;
                }
            };

            const load = async (filePath : string)=>{
                let fullPath = filePath;
                if(option.rootDir){
                    fullPath = option.rootDir + "/" + filePath;
                }
                fullPath = fullPath.split("//").join("/");
                const result = await option.context.loadFile(fullPath, option);
                echo(result);
            };

            await eval("(async () => {" + scString + "})();");
        }catch(err){
            console.log(err);
        }

        return ___output___;
    }
}