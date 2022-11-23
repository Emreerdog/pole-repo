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

    contentState.pageContentState["LifeCheckServices"] = new Array();

    for(var i = 0; i < contentState.pageContentState["DomainInputs"].length; i++)
    {
        let topArray = new Array();
        let lifeCheckObject = {hostMachine: contentState.pageContentState["DomainInputs"][i], openServices : topArray};
        for(var j = 0; j < contentState.pageContentState["ComponentList"].component_configurations.length; j++)
        {
            if(contentState.pageContentState["ComponentList"].component_configurations[j].click_state == true)
            {
                if(contentState.pageContentState["ComponentList"].component_configurations[j].service_list == "")
                {

                }
                else
                {
                    for(var k = 0; k < contentState.pageContentState["ComponentList"].component_configurations[j].service_list.length; k++)
                    {
                        let myObject = {service: contentState.pageContentState["ComponentList"].component_configurations[j].service_list[k].service, port: contentState.pageContentState["ComponentList"].component_configurations[j].service_list[k].port};
                        contentState.pageContentState["ComponentList"].component_configurations[j].service_list[k]
                        if(contentState.pageContentState["ComponentList"].component_configurations[j].service_list[k].level == 1)
                        {
                            if(lifeCheckObject.hostMachine != contentState.pageContentState["MasterNode"])
                            {

                            }
                            else
                            {
                                lifeCheckObject.openServices.push(myObject);
                            }
                        }
                        else
                        {
                            lifeCheckObject.openServices.push(myObject);
                        }
                    }
                    // lifeCheckObject.openServices.push(contentState.pageContentState["ComponentList"].component_configurations[j].service_list);      
                }
            }
        }
        //lifeCheckObject.openServices.push(contentState.pageContentState["ComponentList"].default_services);
        contentState.pageContentState["LifeCheckServices"].push(lifeCheckObject);
    }

    contentState.pageContentState["ComponentList"]
    for(var i = 0; i < contentState.pageContentState["LifeCheckServices"].length; i++)
    {
        for(var j = 0; j < contentState.pageContentState["ComponentList"].default_services.length; j++)
        {
            let newObj = {service: contentState.pageContentState["ComponentList"].default_services[j].service, port: contentState.pageContentState["ComponentList"].default_services[j].port};
            contentState.pageContentState["LifeCheckServices"][i].openServices.push(newObj);       
        }
    }

    console.log(contentState.pageContentState["LifeCheckServices"]);

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

