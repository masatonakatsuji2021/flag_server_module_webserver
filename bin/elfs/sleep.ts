export default (timeout) : Promise<boolean>=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(true);
        }, timeout);
    });
};