var PreLoad = function(contentState)
{
    // If it returns 0
    // We can proceed

    contentState.pageContentState["SelectedComponents"] = new Array();

    for(var i = 0; i < 19; i++)
    {
        var compObject = document.getElementById("comp" + i);
        console.log(compObject.checked);
        if(compObject.checked == true)
        {
            contentState.pageContentState["SelectedComponents"].push(compObject.value);
        }
    }

    if(contentState.pageContentState["SelectedComponents"].length == 0)
    {
        var logMsg = document.getElementById("logMessage");
        logMsg.style.display = "block";
        return 1;
        
    }
    return 0;
}

var OnLoad = function(contentState)
{
    var urlField = document.getElementById("repoUrl");

    if(contentState.pageContentState["SelectedUrl"] != undefined)
    {
        urlField.value = contentState.pageContentState["SelectedUrl"];
    }
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;