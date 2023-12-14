import Util from "@flagfw/flag/bin/Util";
import ElfSandbox from "./ElfSandbox";
import * as fs from "fs";

export default class Elf{

    public static header = "<?";
    public static footer = "?>";

    private static convertEchob64(code : string) : string{
        return "echob64(\"" + Util.base64Encode(code) + "\");";
    }

    public static async loadFile(filePath : string , option? : Object){
        const content = fs.readFileSync(filePath).toString();
        return await Elf.convert(content, option);
    }

    public static async convert(codeString : string, option? : Object){

        if(!option){
            option = {};
        }

        const buffer1 = codeString.split(Elf.header);

        let decString : string = "";
        for(let n = 0 ; n < buffer1.length ; n++){
            const b_ = buffer1[n];

            if(n == 0){
                if(b_){
                    decString += Elf.convertEchob64(b_);
                }
                continue;
            }

            const b2_ = b_.split(Elf.footer);
            decString += b2_[0];
            if(b2_[1]){
                decString += Elf.convertEchob64(b2_[1]);
            }
        }

        // @ts-ignore
        option.context = Elf;

        return await ElfSandbox.sandbox(decString, option);
    }
    
}