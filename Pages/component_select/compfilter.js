var PreLoad = function(contentState)
{
    // If it returns 0
    // We can proceed
    
    var masterNodeSelector = document.getElementById("masterSelect");
    contentState.pageContentState["MasterNode"] = masterNodeSelector.value;

    return 0;
}

var OnLoad = function(contentState)
{
    if(contentState.pageContentState["ComponentList"] == undefined)
    {
        contentState.pageContentState["ComponentList"] = new Array();
    }

    for(var i = 0; i < 19; i++)
    {
        var compObject = document.getElementById("comp" + i);
        if(contentState.pageContentState["SelectedComponents"] == undefined)
        {
            // 
        }
        else
        {
            for(var j = 0; j < contentState.pageContentState["SelectedComponents"].length; j++)
            {
                if(contentState.pageContentState["SelectedComponents"][j] == compObject.value)
                {
                    compObject.checked = true;
                }
            }
        }
    }
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;