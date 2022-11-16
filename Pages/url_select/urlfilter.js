var PreLoad = function(contentState)
{
    // If it returns 0
    // We can proceed

    contentState.pageContentState["SelectedComponents"] = new Array();

    for(var i = 0; i < 19; i++)
    {
        var compObject = document.getElementById("comp" + i);
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
    var repoField = document.getElementById("repoUrlText");
    var urlField = document.getElementById("repoUrl");

    urlField.onchange = function () {
        repoField.value = urlField.value;
    }

    var advanceCheck = document.getElementById("advanceCheck");

    advanceCheck.onclick = function (){
        contentState.pageContentState["AdvanceChecked"] = advanceCheck.checked;
        if(contentState.pageContentState["AdvanceChecked"] == true)
        {
            repoField.style.display = "block";
            repoField.value = urlField.value;
        }

        else
        {
            repoField.style.display = "none";
        }
    }

    if(contentState.pageContentState["AdvanceChecked"] != undefined)
    {
        if(contentState.pageContentState["AdvanceChecked"] == true)
        {
            repoField.style.display = "block";
            advanceCheck.checked = true;
        }

        else
        {
            repoField.style.display = "none";
        }
    }

    if(contentState.pageContentState["SelectedUrl"] != undefined)
    {
        urlField.value = contentState.pageContentState["SelectedUrl"];
        repoField.value = contentState.pageContentState["SelectedUrl"];
    }
}


var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;

