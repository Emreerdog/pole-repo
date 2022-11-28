var PreLoad = function(){
    const {ipcRenderer} = require("electron");
    ipcRenderer.invoke("pole-app-close");
    return 0;
}

var OnLoad = function(){
    return 0;
}

var exportFunctions = [PreLoad, OnLoad];
module.exports = exportFunctions;