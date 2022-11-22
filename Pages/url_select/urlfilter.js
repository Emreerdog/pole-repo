var PreLoad = function(contentState)
{
    // If it returns 0
    // We can proceed

    for(var i = 0; i < contentState.pageContentState["ComponentList"].component_configurations.length; i++)
    {
        var compObject = document.getElementById("comp" + i);
        if(compObject.checked == true)
        {
            contentState.pageContentState["ComponentList"].component_configurations[i].click_state = true;
        }
        else
        {
            contentState.pageContentState["ComponentList"].component_configurations[i].click_state = false;
        }
    }

    for(var i = 0; i < contentState.pageContentState["ComponentList"].component_configurations.length; i++)
    {
        if(contentState.pageContentState["ComponentList"].component_configurations[i].click_state == true)
        {
            return 0;
        }
    }
    
    var logMsg = document.getElementById("logMessage");
    logMsg.style.display = "block";
    return 1;
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

