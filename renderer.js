const information = document.getElementById('wowman');
const nextButton = document.getElementById('nextButton');
const pageContent = document.getElementById('contentPart');
var x = 6;
var domainInputCounter = 1;

var page1 = "<h5>Welcome To The Poleposition Installer</h5>" + 
"<br>"+
"<p id='wowman'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis venenatis turpis. Donec ex erat, semper vel arcu ut, bibendum ultrices sem. Pellentesque sed venenatis nisl, sed placerat turpis. Fusce sed egestas magna, ut molestie magna</p>" +
"<br>"+
"<p>Press Next To continue";

var page2 = "<h5>Domain Selection</h5>"+
"<br>"+
"<small class='text-danger' id='logMessage'>*Domain fields can not be blank!</small>"+
"<p>Enter your domains</p>"+
"<br>"+
"<div>"+
  "<div class='row bg-dark w-100' id='addRemoveButtons'>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-success' id='domainAdd'>Add</button>"+
    "</div>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-danger' id='rmvButton'>Remove</button>"+
    "</div>"+
  "</div>"+
"</div>"+
"<div id='textContainer' class='bg-danger'>"+
  "<input type='text' class='w-100' id='domainInput0'>"+
"</div>";

var page3 = "<h5>Master Node Selection</h5>"+
"<br>"+
"<p>Select your master node:</p>"+
"<select name='masterSelect' id='masterSelect'>"+
"</select>";

var page4 = "<h5>Bigtop Cluster Components</h5>"+
"<p>Select your cluster components</p>"+
"<div class='row'>"+
 "<div class='col-md-6'>"+
    "<input type='checkbox' id='comp0' name='comp0' value='alluxio'>"+
    "<label for='comp0'> alluxio</label><br>"+
    "<input type='checkbox' id='comp1' name='comp1' value='ambari'>"+
    "<label for='comp1'> ambari</label><br>"+
    "<input type='checkbox' id='comp2' name='comp2' value='flink'>"+
    "<label for='comp2'> flink</label><br>"+
    "<input type='checkbox' id='comp3' name='comp3' value='gpdb'>"+
    "<label for='comp3'> gpdb</label><br>"+
    "<input type='checkbox' id='comp4' name='comp4' value='hbase'>"+
    "<label for='comp4'> hbase</label><br>"+
    "<input type='checkbox' id='comp5' name='comp5' value='hcat'>"+
    "<label for='comp5'> hcat</label><br>"+
    "<input type='checkbox' id='comp6' name='comp6' value='hive'>"+
    "<label for='comp6'> hive</label><br>"+
    "<input type='checkbox' id='comp7' name='comp7' value='httpfs'>"+
    "<label for='comp7'> httpfs</label><br>"+
    "<input type='checkbox' id='comp8' name='comp8' value='zookeeper'>"+
    "<label for='comp8'> zookeeper</label><br>"+
    "<input type='checkbox' id='comp9' name='comp9' value='kafka'>"+
    "<label for='comp9'> kafka</label>"+
  "</div>"+
  "<div class='col-md-6'>"+
    "<input type='checkbox' id='comp10' name='comp10' value='mapred-app'>"+
    "<label for='comp10'> mapred-app</label><br>"+
    "<input type='checkbox' id='comp11' name='comp11' value='oozie'>"+
    "<label for='comp11'> oozie</label><br>"+
    "<input type='checkbox' id='comp12' name='comp12' value='solrcloud'>"+
    "<label for='comp12'> solrcloud</label><br>"+
    "<input type='checkbox' id='comp13' name='comp13' value='spark'>"+
    "<label for='comp13'> spark</label><br>"+
    "<input type='checkbox' id='comp14' name='comp14' value='spark-standalone'>"+
    "<label for='comp14'> spark-standalone</label><br>"+
    "<input type='checkbox' id='comp15' name='comp15' value='sqoop'>"+
    "<label for='comp15'> sqoop</label><br>"+
    "<input type='checkbox' id='comp16' name='comp16' value='tez'>"+
    "<label for='comp16'> tez</label><br>"+
    "<input type='checkbox' id='comp17' name='comp17' value='yarn'>"+
    "<label for='comp17'> yarn</label><br>"+
    "<input type='checkbox' id='comp18' name='comp18' value='ycsb'>"+
    "<label for='comp18'> ycsb</label><br>"+
    "<input type='checkbox' id='comp19' name='comp19' value='phoenix'>"+
    "<label for='comp19'> phoenix</label>"+
  "</div>"+
"</div>"

var page5 = "<h5>Repo URL</h5>"+
"<br>"+
"<p>Select Bigtop Repo URL:</p>"+
"<br>"+
"<label for='repoUrl'>Repo URL: </label>"+
"<input type='text' id='repoUrl' name='repoUrl' class='w-100'>"

var page6 = "<h5>Install Path</h5>"+
"<br>"+
"<p>Enter your installation paths:</p>"+
"<br>"+
"<div>"+
  "<div class='row bg-dark w-100' id='pathAddRemove'>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-success' id='pathAddButton'>Add</button>"+
    "</div>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-danger' id='pathRemoveButton'>Remove</button>"+
    "</div>"+
  "</div>"+
"</div>"+
"<div id='pathContainer'>"+
  "<input type='text' class='w-100' id='pathInput0'>"+
"</div>"

const pageArray = [page1, page2];
var pageCounter = 0;
var pathCounter = 1;
var domainCounter = 1;
var inputDomains = new Array();
var ourMasterNode;
var ourRepoUrl;
var bigtopComponents = new Array();

const {NodeSSH} = require('node-ssh');

function addDomainLogic(){
    var textContainerPart = document.getElementById("textContainer");
    var newChild = document.createElement("input");
    newChild.type = "text";
    newChild.className = "w-100";
    newChild.id = "domainInput" + domainCounter;
    textContainerPart.appendChild(newChild);
    domainCounter++;
}

function removeDomainLogic(){
    if(domainCounter == 1)
    {
        return;
    }
    var textContainerPart = document.getElementById("textContainer");
    textContainerPart.removeChild(textContainerPart.lastChild);
    domainCounter--;
}

function pathAddLogic()
{
    var pathTextContainer = document.getElementById("pathContainer");
    var newChild = document.createElement("input");
    newChild.type = "text";
    newChild.className = "w-100";
    newChild.id = "pathInput" + pathCounter;
    pathTextContainer.appendChild(newChild);
    pathCounter++;
}

function pathRemoveLogic()
{   
    if(pathCounter == 1)
    {
        return;
    }
    var pathTextContainer = document.getElementById("pathContainer");
    pathTextContainer.removeChild(pathTextContainer.lastChild);
    pathCounter--;
}

nextButton.addEventListener('click', () => {
    
    if(pageCounter == 0)
    {
        pageContent.innerHTML = page1;
    }

    else if(pageCounter == 1)
    {
        pageContent.innerHTML = page2;
        var domainAddButton = document.getElementById("domainAdd");
        var domainRemoveButton = document.getElementById("rmvButton");
        domainAddButton.onclick = addDomainLogic;
        domainRemoveButton.onclick = removeDomainLogic;
    }
    
    else if(pageCounter == 2){
        var textContainerPart = document.getElementById("textContainer");
        var logMsg = document.getElementById("logMessage");
        var domainChild = textContainerPart.children;
        var ourChildLenght = domainChild.length;
    
        for(var i = 0; i < domainChild.length; i++)
        {
            var currentChild = domainChild[i];
            if(currentChild.value == "")
            {
                logMsg.style.display = "block";
                return;
            }
            inputDomains.push(currentChild.value);
        }

        pageContent.innerHTML = page3;
        var masterNodeSelector = document.getElementById("masterSelect");
        for(var i = 0; i < inputDomains.length; i++)
        {
            var optionElement = document.createElement("option");
            optionElement.innerHTML = inputDomains[i];
            masterNodeSelector.appendChild(optionElement);
        }
    }

    if(pageCounter == 3)
    {
        var masterNodeSelector = document.getElementById("masterSelect");
        ourMasterNode = masterNodeSelector.value;
        pageContent.innerHTML = page4;
    }

    if(pageCounter == 4)
    {
        
        var isElementSelected = false;

        for(var i = 0; i < 10; i ++)
        {
            var inputElem = document.getElementById("comp"+i);
            if(inputElem.checked == true)
            {
                bigtopComponents.push(inputElem.value);
                isElementSelected = true;
            }
        }

        for(var i = 10; i < 20; i++)
        {
            var inputElem = document.getElementById("comp"+i);
            if(inputElem.checked == true)
            {
                bigtopComponents.push(inputElem.value);
                isElementSelected = true;
            }
        }

        if(isElementSelected == false)
        {
            return;
        }
        pageCounter++;
    }

    if(pageCounter == 5)
    {
        pageContent.innerHTML = page5;
    }

    if(pageCounter == 6)
    {
        var repoUrlText = document.getElementById("repoUrl");
        if(repoUrlText.value == "")
        {
            // Repo url can not be empty
            return;
        }

        ourRepoUrl = repoUrlText.value;
        pageContent.innerHTML = page6;
        var pathAddBut = document.getElementById("pathAddButton");
        var pathRemoveBut = document.getElementById("pathRemoveButton");

        pathAddBut.onclick = pathAddLogic;
        pathRemoveBut.onclick = pathRemoveLogic;
    }

    pageCounter++;
});


























// const password = '1234'
//     const ssh = new NodeSSH();
//     information.innerHTML = "Instance oldu";
// ssh.connect({
//   host: '192.168.0.12',
//   host:'centos1', //is not working Windows now.
//   username: 'root',
//   port: 22,
//   password,
//   tryKeyboard: true,
// })
// .then(function(){
//     information.innerHTML = "Connected";

// })
// .then(function() {
//     Local, Remote
//     ssh.putFile('C:/Users/USER/Desktop/deneme-nodessh-poleposition/poleposition/installer.sh', '/home/centos/poleposition/installer.sh').then(function() {
//         information.innerHTML = "File thing is done";
//     }, function(error) {
//         information.innerHTML = error;
// }).then(function(){
//     ssh.execCommand('chmod +x ./installer.sh',{ cwd:'/home/centos/poleposition'}).then(function()
//     {
//         information.innerHTML = "File thing is done 2";

//     }, function(error) {
//         information.innerHTML = error;
//     })
// }).then(function(){
//     ssh.execCommand('./installer.sh', { cwd:'/home/centos/poleposition' }).then(function(result) {
//         console.log('STDOUT: ' + result.stdout)
//         information.innerHTML = result.stderr;

//       })
// })
// })