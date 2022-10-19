const information = document.getElementById('wowman');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');
const pageContent = document.getElementById('contentPart');

const fs = require('fs');

var x = 6;
var domainInputCounter = 1;

var page1 = "<h5>Welcome To The Poleposition Installer</h5>" + 
"<br>"+
"<p id='wowman'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis venenatis turpis. Donec ex erat, semper vel arcu ut, bibendum ultrices sem. Pellentesque sed venenatis nisl, sed placerat turpis. Fusce sed egestas magna, ut molestie magna</p>" +
"<br>"+
"<p>Press Next To continue";

var page2 = "<h5>Domain Selection</h5>"+
"<br>"+
"<small class='text-danger' id='logMessage'>*Domain fields can not be blank</small>"+
"<p>Enter your domains</p>"+
"<div id='buttonsContainer'>"+
  "<div class='row w-100' id='addRemoveButtons'>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-dark' id='domainAdd'><bold>+</bold></button>"+
    "</div>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-dark' id='rmvButton'><bold>-</bold></button>"+
    "</div>"+
  "</div>"+
"</div>"+
"<div id='textContainer'>"+
  "<input type='text' class='w-100 mb-1' id='domainInput0'>"+
"</div>";

var page3 = "<h5>Master Node Selection</h5>"+
"<br>"+
"<p>Select your master node:</p>"+
"<select name='masterSelect' id='masterSelect'>"+
"</select>";

var page4 = "<h5>Bigtop Cluster Components</h5>"+
"<small class='text-danger' id='logMessage'>*At least one cluster must be selected</small>"+
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
"<small class='text-danger' id='logMessage'>*Repo field can not be blank</small>"+
"<p>Enter Bigtop Repo URL:</p>"+
"<label for='repoUrl'>Repo URL: </label>"+
"<input type='text' id='repoUrl' name='repoUrl' class='w-100' value='http://repos.bigtop.apache.org/releases/3.1.1/rockylinux/8/x86_64'>"

var page6 = "<h5>Install Path</h5>"+
"<small class='text-danger' id='logMessage'>*Installation paths must be supplied</small>"+
"<p>Enter your installation paths:</p>"+
"<div id='buttonsContainer'>"+
  "<div class='row w-100' id='addRemoveButtons'>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-dark' id='pathAddButton'><bold>+</bold></button>"+
    "</div>"+
    "<div class='col-md-6'>"+
      "<button type='button' class='btn btn-dark' id='pathRemoveButton'><bold>-</bold></button>"+
    "</div>"+
  "</div>"+
"</div>"+
"<div id='textContainer'>"+
  "<input type='text' class='w-100 mb-1' id='pathInput0' placeholder='/home/data/0'>"+
"</div>"

var pageCounter = 0;
var pathCounter = 1;
var countpath = 1;
var domainCounter = 1;

var inputDomains = new Array();
var ourMasterNode;
var ourRepoUrl = "";
var bigtopComponents = new Array();
var installationPaths = new Array();
var domaninKeyVal = new Array();
var sshObject;
var selectedDomain;

const {NodeSSH} = require('node-ssh');

pageContent.innerHTML = page1;
pageCounter++;

function domainLogSelect()
{
  var myDoms = document.getElementById("domainSelect");
  var sLog = document.getElementById("sshLog");
  for(var i = 0; i < domaninKeyVal.length; i++)
  {
    var tempObject = domaninKeyVal[i];
    if(tempObject.sshConfig.host == myDoms.value)
    {
      selectedDomain = tempObject;
      console.log(selectedDomain);
      sLog.value = selectedDomain.personalLog;
      break;
    }
  }
}

function reloadDomains(){
  backButton.className = "btn btn-dark btn-sm";
  pageContent.innerHTML = page2;
  var domainAddButton = document.getElementById("domainAdd");
  var domainRemoveButton = document.getElementById("rmvButton");

  domainAddButton.onclick = addDomainLogic;
  domainRemoveButton.onclick = removeDomainLogic;
  
  domainCounter = 1;

  if(inputDomains.length != 0)
  {
    var rawContainer = document.getElementById("textContainer");
    var textContainerPart = rawContainer.children;
    textContainerPart[0].value = inputDomains[0];
    for(var i = 1; i < inputDomains.length; i++)
    {
      var newChild = document.createElement("input");
      newChild.type = "text";
      newChild.className = "w-100 mb-1";
      newChild.id = "domainInput" + domainCounter;
      newChild.value = inputDomains[i];
      
      rawContainer.appendChild(newChild);

      domainCounter++;
    }
  }
}

function addDomainLogic(){
    var textContainerPart = document.getElementById("textContainer");
    var newChild = document.createElement("input");
    newChild.type = "text";
    newChild.className = "w-100 mb-1";
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
    if(inputDomains.length != 0)
    {
      if(inputDomains[inputDomains.length - 1] == textContainerPart.lastChild.value)
      {
        inputDomains.pop();
      }
    }
    textContainerPart.removeChild(textContainerPart.lastChild);
    domainCounter--;
}

function pathAddLogic()
{
    var pathTextContainer = document.getElementById("textContainer");
    var newChild = document.createElement("input");
    newChild.type = "text";
    newChild.className = "w-100 mb-1";
    newChild.id = "pathInput" + pathCounter;
    newChild.placeholder = "/home/data/" + countpath;
    pathTextContainer.appendChild(newChild);
    pathCounter++;
    countpath++;
}

function pathRemoveLogic()
{   
    if(pathCounter == 1)
    {
        return;
    }
    var pathTextContainer = document.getElementById("textContainer");
    pathTextContainer.removeChild(pathTextContainer.lastChild);
    pathCounter--;
}
//added preinstaller
function startShellExecutePre(vals)
{
  var mSSHLog = document.getElementById("sshLog");
  if(vals.modExecuted == false)
  {
    vals.personalLog += "Configuration failed preinstaller(" + vals.sshConfig.host + ")\n";
    mSSHLog.value += "Configuration failed preinstaller(" + selectedDomain.sshConfig.host + ")\n";
  }
  else
  {
    vals.personalLog += "Executing shell for preinstaller(" + vals.sshConfig.host + ")\n";
    mSSHLog.value += "Executing shell preinstaller(" + selectedDomain.sshConfig.host + ")\n";
    vals.sshInstance.execCommand('./preinstaller.sh', { cwd:'/home/poleposition' }).then(function(result){
      vals.personalLog += "STDOUT(" + vals.sshConfig.host + "): " + result.stdout + "\n";
      vals.personalLog += "STDERR(" + vals.sshConfig.host + "): " + result.stderr + "\n";
      mSSHLog.value += "STDOUT(" + selectedDomain.sshConfig.host + "): " + result.stdout + "\n";
      mSSHLog.value += "STDERR(" + selectedDomain.sshConfig.host + "): " + result.stderr + "\n";
    });
    setTimeout(function(){connectThenSend(vals)}, 5000);
  }
}

function sentThenChmodPre(val)
{
  var mSSHLog = document.getElementById("sshLog");
  if(val.fileSent == false)
  {
    // mSSHLog.value += "Unable to send installer file(" + val.sshConfig.host + ")\n";
    mSSHLog.value += "Unable to send preinstaller file(" + selectedDomain.sshConfig.host + ")\n";
    val.personalLog += "Unable to send preinstaller file(" + val.sshConfig.host + ")\n";
  }
  else
  {
    mSSHLog.value += "Setting up configurations preinstaller(" + selectedDomain.sshConfig.host + ")\n";
    val.personalLog += "Setting up configurations preinstaller(" + val.sshConfig.host + ")\n";
    val.sshInstance.execCommand('sudo chmod 777 ./preinstaller.sh',{ cwd:'/home/poleposition'}).then(function(){
      val.modExecuted = true;
    });
    setTimeout(function(){startShellExecutePre(val)}, 5000);
  }
}

function connectThenSendPre(value, index, selfArray)
{
  var mSSHLog = document.getElementById("sshLog");
  if(value.sshInstance.isConnected() == false || value.sshInstance == undefined)
  {
    mSSHLog.value += "Unable to connect host preinstaller(" + value.sshConfig.host + ")\n"; 
    //vals.personalLog += "Unable to connect host(" + value.sshConfig.host + ")\n"; 
  }
  else
  {
    value.personalLog += "Connected host preinstaller(" + value.sshConfig.host + ")\n";
    
    mSSHLog.value += "Connected host preinstaller(" + selectedDomain.sshConfig.host + ")\n";
    value.sshInstance.putFile('preinstaller.sh', '/home/poleposition/preinstaller.sh').then(function(){
      mSSHLog.value += "Preinstaller file sent(" + selectedDomain.sshConfig.host + ")\n";
      value.personalLog += "Preinstaller file sent(" + value.sshConfig.host + ")\n";
      value.fileSent = true;
    });
    setTimeout(function(){sentThenChmodPre(value)}, 5000);
  }
}
//finshed preinstaller
function startShellExecute(vals)
{
  var mSSHLog = document.getElementById("sshLog");
  if(vals.modExecuted == false)
  {
    vals.personalLog += "Configuration failed(" + vals.sshConfig.host + ")\n";
    mSSHLog.value += "Configuration failed(" + selectedDomain.sshConfig.host + ")\n";
  }
  else
  {
    vals.personalLog += "Executing shell(" + vals.sshConfig.host + ")\n";
    mSSHLog.value += "Executing shell(" + selectedDomain.sshConfig.host + ")\n";
    vals.sshInstance.execCommand('sudo ./installer.sh', { cwd:'/home/poleposition' }).then(function(result){
      vals.personalLog += "STDOUT(" + vals.sshConfig.host + "): " + result.stdout + "\n";
      vals.personalLog += "STDERR(" + vals.sshConfig.host + "): " + result.stderr + "\n";
      mSSHLog.value += "STDOUT(" + selectedDomain.sshConfig.host + "): " + result.stdout + "\n";
      mSSHLog.value += "STDERR(" + selectedDomain.sshConfig.host + "): " + result.stderr + "\n";
    })
  }
}

function sentThenChmod(val)
{
  var mSSHLog = document.getElementById("sshLog");
  if(val.fileSent == false)
  {
    // mSSHLog.value += "Unable to send installer file(" + val.sshConfig.host + ")\n";
    mSSHLog.value += "Unable to send installer file(" + selectedDomain.sshConfig.host + ")\n";
    val.personalLog += "Unable to send installer file(" + val.sshConfig.host + ")\n";
  }
  else
  {
    mSSHLog.value += "Setting up configurations(" + selectedDomain.sshConfig.host + ")\n";
    val.personalLog += "Setting up configurations(" + val.sshConfig.host + ")\n";
    val.sshInstance.execCommand('sudo chmod 777 ./installer.sh',{ cwd:'/home/poleposition'}).then(function(){
      val.modExecuted = true;
    });
    setTimeout(function(){startShellExecute(val)}, 5000);
  }
}

function connectThenSend(value, index, selfArray)
{
  var mSSHLog = document.getElementById("sshLog");
  if(value.sshInstance.isConnected() == false || value.sshInstance == undefined)
  {
    mSSHLog.value += "Unable to connect host(" + value.sshConfig.host + ")\n"; 
    //vals.personalLog += "Unable to connect host(" + value.sshConfig.host + ")\n"; 
  }
  else
  {
    value.personalLog += "Connected host(" + value.sshConfig.host + ")\n";
    
    mSSHLog.value += "Connected host(" + selectedDomain.sshConfig.host + ")\n";
    value.sshInstance.putFile('installer.sh', '/home/poleposition/installer.sh').then(function(){
      mSSHLog.value += "Installer file sent(" + selectedDomain.sshConfig.host + ")\n";
      value.personalLog += "Installer file sent(" + value.sshConfig.host + ")\n";
      value.fileSent = true;
    });
    setTimeout(function(){sentThenChmod(value)}, 5000);
  }
}

nextButton.addEventListener('click', () => {

    if(pageCounter == 1)
    {
        backButton.className = "btn btn-dark btn-sm";
        pageContent.innerHTML = page2;
        var domainAddButton = document.getElementById("domainAdd");
        var domainRemoveButton = document.getElementById("rmvButton");
      
        domainAddButton.onclick = addDomainLogic;
        domainRemoveButton.onclick = removeDomainLogic;
        
        domainCounter = 1;
        if(inputDomains.length != 0)
        {
          var rawContainer = document.getElementById("textContainer");
          var textContainerPart = rawContainer.children;
          textContainerPart[0].value = inputDomains[0];
          for(var i = 1; i < inputDomains.length; i++)
          {
            var newChild = document.createElement("input");
            newChild.type = "text";
            newChild.className = "w-100 mb-1";
            newChild.id = "domainInput" + domainCounter;
            newChild.value = inputDomains[i];
            
            rawContainer.appendChild(newChild);

            domainCounter++;
          }
        }
        pageCounter++;
      
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

            if(inputDomains.length > i)
            {
              inputDomains[i] = currentChild.value;
            }
            else
            {
              inputDomains.push(currentChild.value);
            }
        }
        domainCounter = 1;
        pageContent.innerHTML = page3;
        var masterNodeSelector = document.getElementById("masterSelect");
        for(var i = 0; i < inputDomains.length; i++)
        {
            var optionElement = document.createElement("option");
            optionElement.innerHTML = inputDomains[i];
            masterNodeSelector.appendChild(optionElement);
        }
        pageCounter++;
    }

    else if(pageCounter == 3)
    {
        var masterNodeSelector = document.getElementById("masterSelect");
        ourMasterNode = masterNodeSelector.value;
        pageContent.innerHTML = page4; 
        pageCounter++;
    }

    else if(pageCounter == 4)
    {
        var isElementSelected = false;
        bigtopComponents = new Array();
        for(var i = 0; i < 20; i++)
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
            var logMsg = document.getElementById("logMessage");
            logMsg.style.display = "block";
            return;
        }
        pageContent.innerHTML = page5;
        var repoUrlText = document.getElementById("repoUrl");
        if(ourRepoUrl != "")
        {
          repoUrlText.value = ourRepoUrl;
        }
        pageCounter++;
    }
    else if(pageCounter == 5)
    {   
        var repoUrlText = document.getElementById("repoUrl");
        if(repoUrlText.value == "")
        {
          var logMsg = document.getElementById("logMessage");
          logMsg.style.display = "block";
          return;
        }
        ourRepoUrl = repoUrlText.value;
        pageContent.innerHTML = page6;
        nextButton.innerHTML = "Install";
        pathCounter = 1;

        var pathAddBut = document.getElementById("pathAddButton");
        var pathRemoveBut = document.getElementById("pathRemoveButton");
        
        pathAddBut.onclick = pathAddLogic;
        pathRemoveBut.onclick = pathRemoveLogic;

        
        pageCounter++;
    }

    else if(pageCounter == 6)
    {
        

        var ourTextContainer = document.getElementById("textContainer");
        var tempInstallPaths = ourTextContainer.children;
        installationPaths = new Array();
        for(var i = 0; i < tempInstallPaths.length; i++)
        {
          if(tempInstallPaths[i].value == "")
          {
            var logMsg = document.getElementById("logMessage");
            logMsg.style.display = "block";
            return;
          }
          installationPaths.push(tempInstallPaths[i].value);
        }

        var installTargets = "";
        for(var i = 0; i < installationPaths.length; i++)
        {
          installTargets += "- " + installationPaths[i] + "\n";
        }

        var bigtopPart = "";
        for(var i = 0; i < bigtopComponents.length; i++)
        {
          bigtopPart += "- " + bigtopComponents[i] + "\n";
        }

        var installerTemplate = "#!/bin/bash\n"+
        "RED=\"\\033[0;31m\"; BLUE=\"\\033[0;34m\"; DEFAULTC=\"\\033[0m\"\n"+
        "printf \"\nWelcome to the BEARTELL ${RED}Bigtop${DEFAULTC} installer\n\n\"\n"+
        "# Install Dependencies\n"+
        "#sudo yum -y install git\n\n"+
        "# Install Puppet\n" +
        "sudo rpm -ivh http://yum.puppetlabs.com/puppet5-release-el-8.noarch.rpm\n"+
        "sudo yum -y install puppet\n"+
        "/opt/puppetlabs/bin/puppet module install puppetlabs-stdlib --version 4.12.0\n\n\n"+
        "# Install Bigtop Puppet\n"+
        "#sudo git clone https://github.com/apache/bigtop.git /bigtop-home \n"+
        "sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/\n"+
        "#sudo sh -c \"cd /bigtop-home; git checkout release-3.1.1\"\n"+
        "sudo cp /bigtop-home/bigtop-deploy/puppet/hiera.yaml /etc/puppet/\n\n\n"+
        "sudo find /etc/puppet\n"+
        "# Configure\n"+
        "sudo su root -c \"cat > /etc/puppet/hieradata/site.yaml << EOF\n"+
        "---\n"+
        "bigtop::hadoop_head_node: \"" + ourMasterNode + "\"\n"+
        "hadoop::hadoop_storage_dirs:\n" + installTargets + 
        "hadoop_cluster_node::cluster_components:\n"+"- hdfs\n"+
        bigtopPart+
        "bigtop::jdk_package_name: \"java-1.8.0-openjdk-devel.x86_64\"\n"+
        "bigtop::bigtop_repo_uri: " + "\"" + ourRepoUrl + "\"\n"+
        "EOF\n\"\n\n\n"+
        "# Deploy \n"+
        "echo 'Puppet apply started'\n"+
        "sleep 2\n"+
        "/opt/puppetlabs/bin/puppet apply --hiera_config=/etc/puppet/hiera.yaml --modulepath=/bigtop-home/bigtop-deploy/puppet/modules:/etc/puppet/modules:/usr/share/puppet/modules:/etc/puppetlabs/code/environments/production/modules /bigtop-home/bigtop-deploy/puppet/manifests"
        ;
        
        fs.writeFileSync('installer.sh', installerTemplate);
        
        var entireContent = document.getElementById("contentContainer");
        var footerPart = document.getElementById("footerButtons");
        footerPart.remove();

        entireContent.style.marginLeft = "10px";

        entireContent.innerHTML = "<h5>Installation Started</h5><p>Installation Log:</p>"+
        "<select name='domainSelect' id='domainSelect'></select>"+
        "<textarea id='sshLog' cols='30' rows='10'></textarea>";

        var sshLog = document.getElementById("sshLog");
        var domainSelect = document.getElementById("domainSelect");

        const password = '1234'
        domainCounter = 0;

        for(var i = 0; i < inputDomains.length; i++)
        {
          var ssh = new NodeSSH();
          var myConfig = {host : inputDomains[i],  username: 'root',port: 22,password,tryKeyboard: true};
          sshObject = {sshInstance : ssh, sshConfig : myConfig, fileSent : false, modExecuted : false, personalLog : ""};
          domaninKeyVal.push(sshObject);
          sshObject.sshInstance.connect(sshObject.sshConfig);

          var newDomain = document.createElement("option");
          newDomain.innerHTML = myConfig.host;
          domainSelect.appendChild(newDomain);
        }

        selectedDomain = domaninKeyVal[0];

        domainSelect.onchange = domainLogSelect;

        setTimeout(function(){
          domaninKeyVal.map(connectThenSendPre)
        },
        5000);

        // for(var i = 0; i < inputDomains.length; i++)
        // {
        //   const ssh = new NodeSSH();
        //   var myConfig = {host : inputDomains[domainCounter],  username: 'root',port: 22,password,tryKeyboard: true};
        //   // ssh.connect({
        //   //   host: inputDomains[domainCounter],
        //   //   //host:'centos1', is not working Windows now.
        //   //   username: 'root',
        //   //   port: 22,
        //   //   password,
        //   //   tryKeyboard: true,
        //   // })
        //   ssh.connect(myConfig)
        //   .then(function(){
              
        //       sshLog.value += "Connected Host(" + myConfig.host +')\n';
        //   })
        //   .then(function() {
        //       ssh.putFile('installer.sh', '/home/centos/poleposition/installer.sh').then(function() {
        //           sshLog.value += "File thing is done 1 For host " + myConfig.host + '\n';
                  
        //       }, function(error) {
        //           sshLog.value += 'File error('+ myConfig.host +'): ' + error + '\n';
        //   }).then(function(){
        //       ssh.execCommand('chmod +x ./installer.sh',{ cwd:'/home/centos/poleposition'}).then(function()
        //       {
        //         sshLog.value += "File thing is done 2 For host(" + myConfig.host + ')\n';

        //       }, function(error) {
        //         sshLog.value += 'File error('+ myConfig.host +'): ' + error + '\n';
        //       })
        //   }).then(function(){
        //       ssh.execCommand('./installer.sh', { cwd:'/home/centos/poleposition' }).then(function(result) {
        //           sshLog.value += 'STDOUT(' + myConfig.host + '): ' + result.stdout + '\n';
        //           sshLog.value += 'STDERR(' + myConfig.host + '): ' + result.stderr + '\n';
        //         })
        //   })
        //   })

        //   domainCounter++;
        // }

        console.log(domainCounter);

        // var repoUrlText = document.getElementById("repoUrl");
        // if(repoUrlText.value == "")
        // {
        //     // Repo url can not be empty
        //     var logMsg = document.getElementById("logMessage");
        //     logMsg.style.display = "block";
        //     return;
        // }
        // ourRepoUrl = repoUrlText.value;
        
       

        // if(installPaths.length != 0)
        // {
        //   var pathContainer = document.getElementById("textContainer");
        //   var childArmy = pathContainer.children;
        //   childArmy[0].value = installPaths[0];
        //   for(var i = 1; i < installPaths.length; i++)
        //   {
        //     var newBoy = document.createElement("input");
        //     newBoy.type = "text";
        //     newBoy.className = "w-100 mb-1";
        //     newBoy.id = "pathInput" + pathCounter;
        //     pathContainer.appendChild(newBoy);
        //     pathCounter++;
        //     countpath++;
        //   }
        // }
    }

    
});

backButton.addEventListener('click', () => {
  if(pageCounter == 2){
    // Means we were adding domains
    backButton.className = "btn btn-dark btn-sm disabled";
    pageContent.innerHTML = page1;
  }
  else if(pageCounter == 3){
    // Means we were selecting master
    ourMasterNode = "";
    pageContent.innerHTML = page2;
    reloadDomains();
  }

  else if(pageCounter == 4)
  {
    // Means we were selecting bigtop clusters
    pageContent.innerHTML = page3;
    var masterNodeSelector = document.getElementById("masterSelect");
    for(var i = 0; i < inputDomains.length; i++)
    {
        var optionElement = document.createElement("option");
        optionElement.innerHTML = inputDomains[i];
        masterNodeSelector.appendChild(optionElement);
    }
  }

  else if(pageCounter == 5){
    // Means we were giving repo
    
    pageContent.innerHTML = page4; 
  }

  else if(pageCounter == 6)
  {
    // Means we were giving storage paths
    pageContent.innerHTML = page5;
    nextButton.innerHTML = "Next";
    var repoUrlText = document.getElementById("repoUrl");
    if(ourRepoUrl != "")
    {
      repoUrlText.value = ourRepoUrl;
    }
  }

  pageCounter--;
})

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