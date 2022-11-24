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
    let componentObjects = {component_configurations : undefined};
    if(contentState.pageContentState["ComponentList"] == undefined)
    {
        const fs = require("fs");
        let resultRaw = fs.readFileSync("./components.json");
        componentObjects = JSON.parse(resultRaw);
        contentState.pageContentState["ComponentList"] = componentObjects;
    }

    else
    {
        componentObjects = contentState.pageContentState["ComponentList"];
    }

    // if(resultRaw == undefined)
    // {
    //     let freshFileContent = new Array();
    //     freshFileContent.push({comp_name: "alluxio"});
    //     freshFileContent.push({comp_name: "flink"});
    //     freshFileContent.push({comp_name: "gpdb"});
    //     freshFileContent.push({comp_name: "hbase"});
    //     freshFileContent.push({comp_name: "hcat"});
    //     freshFileContent.push({comp_name: "hive"});
    //     freshFileContent.push({comp_name: "httpfs"});
    //     freshFileContent.push({comp_name: "livy"});
    //     freshFileContent.push({comp_name: "kafka"});
    //     freshFileContent.push({comp_name: "mapred-app"});
    //     freshFileContent.push({comp_name: "oozie"});
    //     freshFileContent.push({comp_name: "solrcloud"});
    //     freshFileContent.push({comp_name: "spark"});
    //     freshFileContent.push({comp_name: "spark-standalone"});
    //     freshFileContent.push({comp_name: "sqoop"});
    //     freshFileContent.push({comp_name: "tez"});
    //     freshFileContent.push({comp_name: "ambari"});
    //     componentObjects.component_configurations = freshFileContent;
    // }
    
    const rightHalf = Math.floor(componentObjects.component_configurations.length / 2);
    
    var leftContainer = document.getElementById("leftSide");
    var rightContainer = document.getElementById("rightSide");

    console.log(componentObjects.component_configurations);
    console.log(rightHalf);

    let componentCounter = 0;
    for(var i = 0; i < componentObjects.component_configurations.length / 2; i++)
    {
        let tempElement = document.createElement("input");
        tempElement.type = "checkbox";
        tempElement.id = "comp" + componentCounter;
        tempElement.name = "comp" + componentCounter;
        tempElement.value = componentObjects.component_configurations[componentCounter].comp_name;
        if(componentObjects.component_configurations[componentCounter].display_state == false)
        {
            tempElement.style.display= "none";
        }
        leftContainer.appendChild(tempElement);

        tempElement = document.createElement("label");
        tempElement.for = "comp" + componentCounter;
        tempElement.innerHTML = componentObjects.component_configurations[componentCounter].comp_name;
        if(componentObjects.component_configurations[componentCounter].display_state == false)
        {
            tempElement.style.display= "none";
        }
        
        leftContainer.appendChild(tempElement);      
        tempElement = document.createElement("br");
        leftContainer.appendChild(tempElement);
        componentCounter++;
    }

    for(var i = 0; i < rightHalf; i++)
    {
        let tempElement = document.createElement("input");
        tempElement.type = "checkbox";
        tempElement.id = "comp" + componentCounter;
        tempElement.name = "comp" + componentCounter;
        tempElement.value = componentObjects.component_configurations[componentCounter].comp_name;
        if(componentObjects.component_configurations[componentCounter].display_state == false)
        {
            tempElement.style.display= "none";
        }
        rightContainer.appendChild(tempElement);

        tempElement = document.createElement("label");
        tempElement.for = "comp" + componentCounter;
        tempElement.innerHTML = componentObjects.component_configurations[componentCounter].comp_name;
        if(componentObjects.component_configurations[componentCounter].display_state == false)
        {
            tempElement.style.display= "none";
        }
        
        rightContainer.appendChild(tempElement);      
        tempElement = document.createElement("br");
        rightContainer.appendChild(tempElement);
        componentCounter++;
    }
    
    for(var i = 0; i < contentState.pageContentState["ComponentList"].component_configurations.length; i++)
    {
        var compObject = document.getElementById("comp" + i);
        compObject.checked = contentState.pageContentState["ComponentList"].component_configurations[i].click_state;
        // if(contentState.pageContentState["SelectedComponents"] == undefined)
        // {
        //     // 
        // }
        // else
        // {
        //     for(var j = 0; j < contentState.pageContentState["SelectedComponents"].length; j++)
        //     {
        //         if(contentState.pageContentState["SelectedComponents"][j] == compObject.value)
        //         {
        //             compObject.checked = true;
        //         }
        //     }
        // }
    }
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;