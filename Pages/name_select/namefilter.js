var PreLoad = function(contentState)
{
    var pathContainer = document.getElementById("textContainer");
    var ourPaths = pathContainer.children;
    var logText = document.getElementById("logMessage");

    contentState.pageContentState["PathInput"] = new Array();

    for(var i = 0; i < ourPaths.length; i++)
    {
        if(ourPaths[i].value == "")
        {
            logText.style.display = "block";
            return 1;
        }
        contentState.pageContentState["PathInput"].push(ourPaths[i].value);
    }

    return 0;
}

var OnLoad = function(contentState)
{
    var methodSelection = document.getElementById("sshMethod");
    var credContainer = document.getElementById("credentialsContainer");
    var keyContainer = document.getElementById("sshFileContainer");
    
    keyContainer.style.display = "none";

    contentState.pageContentState["SSHMethod"] = 0;
    methodSelection.onchange = function () {
        
        if(methodSelection.value == "Credentials")
        {
            keyContainer.style.display = "none";
            credContainer.style.display = "block";
            contentState.pageContentState["SSHMethod"] = 0;
        }
        else{
            credContainer.style.display = "none";
            keyContainer.style.display = "block";
            contentState.pageContentState["SSHMethod"] = 1;
        }
    }
    contentState.SetButtonText("Install");
}

var exportFunctions = [PreLoad, OnLoad];
module.exports = exportFunctions;