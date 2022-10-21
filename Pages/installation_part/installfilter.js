const { NodeSSH } = require("node-ssh");

var sshCommandList = new Array();
var globalCommandCounter = 0;
var connectionInfoObjects = new Array();

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


    sshCommandList.push("sudo yum -y install git");
    sshCommandList.push("sudo rpm -ivh http://yum.puppetlabs.com/puppet5-release-el-8.noarch.rpm");
    sshCommandList.push("sudo yum -y install puppet");
    sshCommandList.push("/opt/puppetlabs/bin/puppet module install puppetlabs-stdlib --version 4.12.0");
    sshCommandList.push("sudo git clone https://github.com/apache/bigtop.git /bigtop-home");
    sshCommandList.push("sudo sh -c \"cd /bigtop-home; git checkout release-3.1.1\"");
    sshCommandList.push("sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/");
    sshCommandList.push("sudo cp /bigtop-home/bigtop-deploy/puppet/hiera.yaml /etc/puppet/");
    sshCommandList.push("sudo find /etc/puppet");
    sshCommandList.push(variadicCommand);
    sshCommandList.push("/opt/puppetlabs/bin/puppet apply --hiera_config=/etc/puppet/hiera.yaml --modulepath=/bigtop-home/bigtop-deploy/puppet/modules:/etc/puppet/modules:/usr/share/puppet/modules:/etc/puppetlabs/code/environments/production/modules /bigtop-home/bigtop-deploy/puppet/manifests");

    var myContent = document.getElementById("contentContainer");
    myContent.style.marginLeft = "10px";
    myContent.innerHTML = "<h5>Installation Started</h5><p>Installation Log:</p>"+
    "<p id='cmdDisplayer'></p>"+
    "<select name='domainSelect' id='domainSelect'></select>"+
    "<textarea id='sshLog' cols='30' rows='10'></textarea>";   

    var commandDisplayer = document.getElementById("cmdDisplayer");

    var commandCount = sshCommandList.length * totalDomainInputs.length;

    for(var i = 0; i < totalDomainInputs.length; i++)
    {
        var sshInstance = new NodeSSH();
        var newConnectionInformation = {selfSsh : sshInstance, isFinished : false, hostInfo : totalDomainInputs[i], outputLog: ""};
        connectionInfoObjects.push(newConnectionInformation);
    }

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
        connectionInfoObjects[i].selfSsh.connect(myConfig).then(function(){
            connectionInfoObjects[i].outputLog = "Connection Established\n";
        });
    }



    commandDisplayer.innerHTML = globalCommandCounter + "/" + commandCount;

    // Do all the ssh thing
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;