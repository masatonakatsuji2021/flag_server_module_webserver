import * as fs from "fs";

export default async (output, filePath, sendData, option)=>{
    let fullPath = filePath;
    if(option.rootDir){
        fullPath = option.rootDir + "/" + filePath;
    }
    fullPath = fullPath.split("//").join("/");
    if(!fs.existsSync(fullPath)){
        throw Error("no such found \"" + filePath + "\".");
    }
    const result = await option.context.loadFile(fullPath, option, sendData);

    output += result;

    return output;
};