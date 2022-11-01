const { NodeSSH } = require("node-ssh");

var sshCommandList = new Array();
var globalCommandCounter = 0;
var connectionInfoObjects = new Array();
var sshLogObject;
var domainSelector;
var workingDomain;

function UpdatePercentage() {
    var currentVal = (100 * globalCommandCounter) / (sshCommandList.length * totalDomainInputs.length);
    document.getElementById("installProgress").style.width = currentVal + '%';
} 
 

function LogSelection()
{
    var outDomain = domainSelector.value;
    for(var i = 0; i < connectionInfoObjects.length; i++)
    {
        if(outDomain == connectionInfoObjects[i].hostInfo)
        {
            workingDomain = connectionInfoObjects[i];
            sshLogObject.value = workingDomain.outputLog;
            return;
        }
    }
}

function ExecuteRecursive(connectionInstance)
{
    if(connectionInstance.cmdIndex == sshCommandList.length)
    {
        return;
    }

    connectionInstance.selfSsh.execCommand(sshCommandList[connectionInstance.cmdIndex]).then(function(cmdResult){

        if(cmdResult.stdout != "")
            {
                connectionInstance.outputLog += 'STDOUT: ' + cmdResult.stdout + '\n';
            }

            if(cmdResult.stderr != "")
            {
                connectionInstance.outputLog += 'STDERR: ' + cmdResult.stderr + '\n';
            }

        globalCommandCounter++;
        UpdatePercentage();
        connectionInstance.outputLog += 'STDOUT: ' + cmdResult.stdout + '\n';
        connectionInstance.outputLog += 'STDERR: ' + cmdResult.stderr + '\n';
        sshLogObject.value = workingDomain.outputLog;
        connectionInstance.cmdIndex++;
        ExecuteRecursive(connectionInstance);
    })
}

function ShellExecutor()
{
    for(var i = 0; i < connectionInfoObjects.length; i++)
    {
        const cnInfo = connectionInfoObjects[i];
        connectionInfoObjects[i].selfSsh.execCommand(sshCommandList[cnInfo.cmdIndex]).then(function(cmdResult){
            if(cmdResult.stdout != "")
            {
                cnInfo.outputLog += 'STDOUT: ' + cmdResult.stdout + '\n';
            }

            if(cmdResult.stderr != "")
            {
                cnInfo.outputLog += 'STDERR: ' + cmdResult.stderr + '\n';
            }
            globalCommandCounter++;
            UpdatePercentage();
            sshLogObject.value = workingDomain.outputLog;
            cnInfo.cmdIndex++;
            ExecuteRecursive(cnInfo);  
        })

    }
}

function ConnectionValidation()
{
    for(var i = 0; i < connectionInfoObjects.length; i++)
    {
        if(connectionInfoObjects[i].selfSsh.isConnected() == false)
        {
            
        }
    }
}

var PreLoad = function(contentState)
{
    var pathContainer = document.getElementById("textContainer");
    var ourPaths = pathContainer.children;
    var logText = document.getElementById("logMessage");

    contentState.pageContentState["PathInput"] = new Array();

    for(var i = 0; i < ourPaths.length; i++)
    {
        if(ourPaths[i].value == "")
        {
            logText.style.display = "block";
            return 1;
        }
        contentState.pageContentState["PathInput"].push(ourPaths[i].value);
    }

    return 0;
}

var OnLoad = function(contentState)
{
    const totalComponents = contentState.pageContentState["SelectedComponents"]; // ARRAY
    const totalDomainInputs = contentState.pageContentState["DomainInputs"]; // ARRAY
    const totalPathInputs = contentState.pageContentState["PathInput"]; // ARRAY

    const givenRepoUrl = contentState.pageContentState["SelectedUrl"]; // STRING
    const givenMasterNode = contentState.pageContentState["MasterNode"]; // STRING


    var componentsString = "";
    for(var i = 0; i < totalComponents.length; i++)
    {
        componentsString += "- " + totalComponents[i] + "\n";
    }
    
    var storageDirectories = "";

    for(var i = 0; i < totalPathInputs.length; i++)
    {
        storageDirectories += "- " + totalPathInputs[i] + "\n";
    }

    var variadicCommand = "sudo su root -c \"cat > /etc/puppet/hieradata/site.yaml << EOF\n"+
    "---\n"+
    "bigtop::hadoop_head_node: \"" + givenMasterNode + "\"\n"+
    "hadoop::hadoop_storage_dirs:\n"+
    storageDirectories +
    "hadoop_cluster_node::cluster_components:\n- hdfs\n"+ componentsString +
    "bigtop::jdk_package_name: \"java-1.8.0-openjdk-devel.x86_64\"\n"+
    "bigtop::bigtop_repo_uri: \"" + givenRepoUrl + "\"\nEOF\n\"";

    contentState.DisableFooterPart();

    sshCommandList.push("sudo yum -y install git");
    sshCommandList.push("sudo rpm -ivh http://yum.puppetlabs.com/puppet5-release-el-8.noarch.rpm");
    sshCommandList.push("sudo yum -y install puppet");
    sshCommandList.push("/opt/puppetlabs/bin/puppet module install puppetlabs-stdlib --version 4.12.0");
    sshCommandList.push("sudo git clone https://github.com/apache/bigtop.git /bigtop-home");
    sshCommandList.push("sudo sh -c \"cd /bigtop-home; git checkout release-3.1.1\"");
    sshCommandList.push("sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/");
    sshCommandList.push("sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/");
    sshCommandList.push("sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/");
    sshCommandList.push("sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/");
    sshCommandList.push("sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/");
    sshCommandList.push("sudo cp /bigtop-home/bigtop-deploy/puppet/hiera.yaml /etc/puppet/");
    sshCommandList.push("sudo find /etc/puppet");
    sshCommandList.push(variadicCommand);
    sshCommandList.push("/opt/puppetlabs/bin/puppet apply --hiera_config=/etc/puppet/hiera.yaml --modulepath=/bigtop-home/bigtop-deploy/puppet/modules:/etc/puppet/modules:/usr/share/puppet/modules:/etc/puppetlabs/code/environments/production/modules /bigtop-home/bigtop-deploy/puppet/manifests");
    sshCommandList.push("sleep 5");
    sshCommandList.push("chown hdfs:hdfs /home/data/")
    sshCommandList.push("echo Necessary ports for each host:");
    sshCommandList.push("echo ----------------");
    sshCommandList.push("echo Default File System Link:");
    sshCommandList.push("hdfs getconf -confKey fs.defaultFS");
    sshCommandList.push("echo ----------------");
    sshCommandList.push("echo Yarn NodeManager Address");
    sshCommandList.push("hdfs getconf -confKey yarn.nodemanager.webapp.address");
    sshCommandList.push("echo ----------------");
    sshCommandList.push("echo DataNode Address");
    sshCommandList.push("hdfs getconf -confKey dfs.datanode.http.address");
    sshCommandList.push("echo ----------------");
    sshCommandList.push("echo NameNode Address");
    sshCommandList.push("hdfs getconf -confKey dfs.namenode.http-address");
    sshCommandList.push("echo ----------------");


    var myContent = document.getElementById("contentContainer");
    myContent.style.marginLeft = "10px";
    myContent.innerHTML = "<h5>Installation Started</h5><p>Installation Log:</p>"+
    "<p id='cmdDisplayer'></p>"+
    "<div class='progress-bar bg-success' role='progressbar' aria-valuenow='25' aria-valuemin='25' aria-valuemax='100' id='installProgress'></div>"+
    "<select name='domainSelect' id='domainSelect'></select>"+
    "<textarea id='sshLog' cols='30' rows='10' disabled></textarea>";   

    sshLogObject = document.getElementById("sshLog");
    var commandDisplayer = document.getElementById("cmdDisplayer");
    domainSelector = document.getElementById("domainSelect");

    domainSelector.onchange = LogSelection;

    var commandCount = sshCommandList.length * totalDomainInputs.length;

    for(var i = 0; i < totalDomainInputs.length; i++)
    {
        var sshInstance = new NodeSSH();
        var newConnectionInformation = {selfSsh : sshInstance, isFinished : false, hostInfo : totalDomainInputs[i], outputLog: "", cmdIndex: 0, connIndex: 0};
        connectionInfoObjects.push(newConnectionInformation);
        newConnectionInformation.connIndex = i;

        var newOption = document.createElement("option");
        newOption.innerHTML = newConnectionInformation.hostInfo;
        domainSelector.appendChild(newOption);
    }

    workingDomain = connectionInfoObjects[0];

    var password = "1234";

    for(var i = 0; i < connectionInfoObjects.length; i++)
    {
        var myConfig = {
            host : connectionInfoObjects[i].hostInfo,
            username: 'root',
            port: 22,
            password,
            tryKeyboard: false
        }
        
        const cnInfo = connectionInfoObjects[i];

        connectionInfoObjects[i].selfSsh.connect(myConfig).then(function(){
            console.log("Hello world");
            console.log(myConfig);
            cnInfo.outputLog += "Connection Established\n";
            sshLogObject.value = workingDomain.outputLog;
        });
    }

    setTimeout(ShellExecutor, 3000);

    commandDisplayer.innerHTML = globalCommandCounter + "/" + commandCount;

    // Do all the ssh thing
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;