var PreLoad = function(contentState)
{
    var containerDisplay = document.getElementById("contentContainer");
    containerDisplay.innerHTML = "<div class='col-md-4 p-0' id='leftPart'>"+
    "<div class='container'>"+
      "<div class='styledimg'><img src='PolePosition.png' /></div>"+
      "<div class='ring'></div>"+
      "<div class='ring'></div>"+
      "<div class='ring'></div>"+
    "</div>"+
  "</div>"+
  "<div class='col-md-8' id='contentPart'>"+
  "</div>";

    contentState.Reload();
    containerDisplay.style.marginLeft = "0px";

    return 0;
}

var OnLoad = function(contentState)
{
    var factor = 0;
    const netlib = require("net");
    // contentState.ButtonSetState("back", true);
    contentState.SetButtonText("Finish");
    const totalComponents = contentState.pageContentState["DomainInputs"];
    for(var i = 0; i < totalComponents.length; i++)
    {
      var ourElement = document.getElementById("controlBlock");
      
      var hostSelect = document.createElement("small");
      hostSelect.innerHTML = "Host (" + totalComponents[i] + ")<br>";
      ourElement.appendChild(hostSelect);
      for(var j = 0; j < contentState.services.length; j++)
      {
        const checkThis = contentState.services[j];
        const checkIndex = j;
        var newText = document.createElement("small");
        newText.innerHTML = "&#x1F534 " + checkThis.service + " (PORT: " + checkThis.port + ")<br>";
        newText.id = "control" + (factor + checkIndex);
        
        ourElement.appendChild(newText);
      }
      factor += contentState.services.length;
    }

    factor = 0;

    for(var i = 0; i < totalComponents.length; i++)
    {
      for(var j = 0; j < contentState.services.length; j++)
      {
        const checkThis = contentState.services[j];
        const checkIndex = j;
        const compIndex = i;
        const myFactor = factor;
        const newSocket = netlib.connect({host : totalComponents[compIndex], port : checkThis.port});
        newSocket.on("connect", () => {
            var controlElement = document.getElementById("control" + (myFactor + checkIndex));
            controlElement.innerHTML = "&#128994 " + checkThis.service + "<br>";
        })
      }
      factor += contentState.services.length;
    }
}

var exportFunctions = [PreLoad, OnLoad];
module.exports = exportFunctions;