const { NodeSSH } = require("node-ssh");

var PreLoad = function(contentState)
{
    // If it returns 0
    // We can proceed
    
    let logViewer = document.getElementById("logMessage");
    let domainContainer = document.getElementById("textContainer");
    let inputDomains = domainContainer.children;

    if(contentState.pageContentState["RemoteControlObject"] != undefined)
    {
        clearInterval(contentState.pageContentState["RemoteControlObject"].intervalInstance);
        contentState.pageContentState["RemoteControlObject"].remoteMachines.forEach((remoteObjInstance) => {
            // DISCONNECT IF CONNECTED
            remoteObjInstance.selfSsh.dispose();
        })
    }

    contentState.pageContentState["DomainInputs"] = new Array();
    contentState.pageContentState["RemoteControlObject"] = {remoteMachines: new Array(), connectedCount: 0, intervalInstance: -1};

    for(var i = 0; i < inputDomains.length; i++)
    {
        if(contentState.pageContentState["DomainInputs"].indexOf(inputDomains[i].value) !== -1)
        {
            logViewer.innerHTML = "*Domain fields can not be same";
            logViewer.style.display = "block";
            return 1;
        }
        if(inputDomains[i].value == "")
        {
            logViewer.innerHTML = "*Domain fields can not be blank";
            logViewer.style.display = "block";
            return 1;
        }
        const tempNode = new NodeSSH();
        
        let remoteObject = {selfSsh : tempNode, hostInfo: inputDomains[i].value, outputLog : "", cmdIndex : 0};
        contentState.pageContentState["RemoteControlObject"].remoteMachines.push(remoteObject);
        contentState.pageContentState["DomainInputs"].push(inputDomains[i].value);
    }

    contentState.pageContentState["RemoteControlObject"].intervalInstance = setInterval(() => {
        if(contentState.pageContentState["RemoteControlObject"].connectedCount == contentState.pageContentState["RemoteControlObject"].remoteMachines.length)
        {
            clearInterval(contentState.pageContentState["RemoteControlObject"].intervalInstance);
            return 1;
        }
        contentState.pageContentState["RemoteControlObject"].remoteMachines.forEach((remoteObjInstance) => {
            const remoteUname = 'root';
            const remotePass = '1234';
            const myConfig = {
                host : remoteObjInstance.hostInfo,
                username: remoteUname,
                port: 22,
                password: remotePass,
                tryKeyboard : false
            };
            
            remoteObjInstance.selfSsh.connect(myConfig).then(() => {
                contentState.pageContentState["RemoteControlObject"].connectedCount++;
            }, (err) => {
                console.log(err);
                contentState.pageContentState["RemoteControlObject"].connectedCount = 0;
                contentState.pageContentState["RemoteControlObject"].remoteMachines.forEach((newRemoteObj) => {
                    newRemoteObj.selfSsh.dispose();
                })
            })
        })
    }, 2000);

    return 0;
}

var OnLoad = function(contentState)
{
    var masterNodeSelector = document.getElementById("masterSelect");
    
    for(var i = 0; i < contentState.pageContentState["DomainInputs"].length; i++)
    {
        var optionElement = document.createElement("option");
        optionElement.value = contentState.pageContentState["DomainInputs"][i];
        optionElement.innerHTML = contentState.pageContentState["DomainInputs"][i];
        masterNodeSelector.appendChild(optionElement);
    }

    if(contentState.pageContentState["MasterNode"] != undefined)
    {
        masterNodeSelector.value = contentState.pageContentState["MasterNode"];
    }
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;