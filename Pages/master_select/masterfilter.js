function checkForDuplicates(array) {
    let valuesAlreadySeen = []
  
    for (let i = 0; i < array.length; i++) {
      let value = array[i]
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        return true
      }
      valuesAlreadySeen.push(value)
    }
    return false
  }
  

var PreLoad = function(contentState)
{
    var returnValue = 0;
    // If it returns 0
    // We can proceed
    
    var logViewer = document.getElementById("logMessage");
    var domainContainer = document.getElementById("textContainer");
    var inputDomains = domainContainer.children;
    var inputDomainscheck = domainContainer.children;

    contentState.pageContentState["DomainInputs"] = new Array();

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
        contentState.pageContentState["DomainInputs"].push(inputDomains[i].value);
    }
    console.log("what");
    return 0;
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