var PreLoad = function(contentState)
{
    // If it returns 0
    // We can proceed

    var urlField = document.getElementById("repoUrl");
    if(urlField.value == "")
    {
        var lgMsg = document.getElementById("logMessage");
        lgMsg.style.display = "block";
        return 1;
    }

    contentState.pageContentState["SelectedUrl"] = urlField.value;
    return 0;
}

var OnLoad = function(contentState)
{
    var addPathButton = document.getElementById("pathAddButton");
    var removePathButton = document.getElementById("pathRemoveButton");
    var pathContainer = document.getElementById("textContainer");
    var ourPaths = pathContainer.children;
    contentState.SetButtonText("Install");
    addPathButton.addEventListener('click', () => {
        var newPath = document.createElement("input");
        newPath.type = "text";
        newPath.className = "w-100 mb-1";
        newPath.id = "pathInput" + ourPaths.length;
        newPath.placeholder = "/home/data/" + ourPaths.length;
    })

    removePathButton.addEventListener('click', () => {
        // Do not remove the last input
        if(ourPaths.length != 1)
        {
            pathContainer.removeChild(pathContainer.lastChild);
        }
    })

    console.log("loaded path filter");
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;