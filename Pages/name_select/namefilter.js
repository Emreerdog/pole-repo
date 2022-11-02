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
    contentState.SetButtonText("Install");
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;