const { count } = require("console");

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
    const totalComponents = contentState.pageContentState["LifeCheckServices"];
    const lifeServices = contentState.pageContentState["LifeCheckServices"];
    let countServices = 0;
    for(var i = 0; i < lifeServices.length; i++)
    {
        var ourElement = document.getElementById("controlBlock");
        var hostSelect = document.createElement("small");
        hostSelect.innerHTML = "Host (" + lifeServices[i].hostMachine + ")<br>";
        ourElement.appendChild(hostSelect);
        for(var j = 0; j < lifeServices[i].openServices.length; j++)
        {
            let newText = document.createElement("small");
            newText.innerHTML = "&#x1F534 " + lifeServices[i].openServices[j].service + " (PORT: " + lifeServices[i].openServices[j].port + ")<br>";
            newText.id = "control" + (countServices + j);
        }
        countServices += lifeServices[i].openServices.length;
    }

    countServices = 0;

    for(var i = 0; i < lifeServices.length; i++)
    {
        const compIndex = i;
        for(var j = 0; j < lifeServices[i].openServices.length; j++)
        { 
            const serviceIndex = countServices + j;
            const newSocket = netlib.connect({host: lifeServices[compIndex].hostMachine, port: lifeServices[compIndex].openServices[serviceIndex].port});
            newSocket.on("connect", () => {
              document.getElementById("control" + serviceIndex).innerHTML = "&#128994 " + lifeServices[compIndex].openServices[serviceIndex].service + " PORT(" + lifeServices[compIndex].openServices[serviceIndex].port + ")<br>";
            })  
        }
        countServices += lifeServices[i].openServices.length;
    }
}

var exportFunctions = [PreLoad, OnLoad];
module.exports = exportFunctions;