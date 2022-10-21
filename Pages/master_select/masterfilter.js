var PreLoad = function(contentState)
{
    var returnValue = 0;
    // If it returns 0
    // We can proceed
    
    var logViewer = document.getElementById("logMessage");
    var domainContainer = document.getElementById("textContainer");
    var inputDomains = domainContainer.children;

    contentState.pageContentState["DomainInputs"] = new Array();

    for(var i = 0; i < inputDomains.length; i++)
    {
        if(inputDomains[i].value == "")
        {
            logViewer.innerHTML = "*Domain fields can not be blank";
            logViewer.style.display = "block";
            returnValue = 1;
        }
        contentState.pageContentState["DomainInputs"].push(inputDomains[i].value);
    }

    return returnValue;
}

var OnLoad = function(contentState)
{
    var masterNodeSelector = document.getElementById("masterSelect");
    for(var i = 0; i < contentState.pageContentState["DomainInputs"].length; i++)
    {
        var optionElement = document.createElement("option");
        optionElement.innerHTML = contentState.pageContentState["DomainInputs"][i];
        masterNodeSelector.appendChild(optionElement);
    }
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;