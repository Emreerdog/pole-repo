const { NodeSSH } = require("node-ssh");

var totalDomainInputs;
var sshCommandList;
var globalCommandCounter;
var connectionInfoObjects;
var sshLogObject;
var domainSelector;
var workingDomain;
var myContentState;

function RemainingPercentage()
{
    const totalLength = (sshCommandList.length * totalDomainInputs.length);
    var currentVal = (100 * globalCommandCounter) / totalLength;
    return currentVal;
}

function UpdatePercentage() {
    const totalLength = (sshCommandList.length * totalDomainInputs.length);
    document.getElementById("installProgress").style.width = RemainingPercentage() + '%';
    document.getElementById("cmdDisplayer").innerHTML = globalCommandCounter + '/' + totalLength;
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
        const totalLength = (sshCommandList.length * totalDomainInputs.length);
        if(totalLength / globalCommandCounter == 1)
        {
            myContentState.ButtonSetState("back", true);
            myContentState.ButtonSetState("next", false);
        }
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

function StartRemoteInstallation()
{
    const totalComponents = myContentState.pageContentState["SelectedComponents"]; // ARRAY
    const totalPathInputs = myContentState.pageContentState["PathInput"]; // ARRAY

    const givenRepoUrl = myContentState.pageContentState["SelectedUrl"]; // STRING
    const givenMasterNode = myContentState.pageContentState["MasterNode"]; // STRING

    sshCommandList = new Array();
    globalCommandCounter = 0;
    connectionInfoObjects = new Array();
    sshLogObject = undefined;
    domainSelector = undefined;
    workingDomain = undefined

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
    "hadoop_cluster_node::cluster_components:\n- hdfs-non-ha\n- zookeeper\n"+ componentsString +
    "bigtop::jdk_package_name: \"java-1.8.0-openjdk-devel.x86_64\"\n"+
    "bigtop::bigtop_repo_uri: \"" + givenRepoUrl + "\"\nEOF\n\"";

    sshCommandList.push("sudo yum -y install git");
    sshCommandList.push("sudo rpm -ivh http://yum.puppetlabs.com/puppet5-release-el-8.noarch.rpm");
    sshCommandList.push("sudo yum -y install puppet");
    sshCommandList.push("/opt/puppetlabs/bin/puppet module install puppetlabs-stdlib --version 4.12.0");
    sshCommandList.push("sudo git clone https://github.com/beartell/bigtop.git /bigtop-home");
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
    sshCommandList.push("echo Install finished.");

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

    const uNAME = myContentState.pageContentState["SSHUsername"];
    const password = myContentState.pageContentState["SSHPassword"];
    
    myContentState.ButtonSetState("back", true);
    myContentState.ButtonSetState("next", true);
    myContentState.SetButtonText("Check");
    
    for(var i = 0; i < connectionInfoObjects.length; i++)
    {
        var myConfig = {
            host : connectionInfoObjects[i].hostInfo,
            username: uNAME,
            port: 22,
            password,
            tryKeyboard: false
        }
        
        const cnInfo = connectionInfoObjects[i];

        connectionInfoObjects[i].selfSsh.connect(myConfig).then(function(){
            cnInfo.outputLog += "Connection Established\n";
            sshLogObject.value = workingDomain.outputLog;
        });
    }
    
    setTimeout(ShellExecutor, 3000);
    commandDisplayer.innerHTML = globalCommandCounter + "/" + commandCount;
}

var PreLoad = function(contentState)
{
    if(contentState.pageContentState["SSHMethod"] == undefined)
    {
        return 1;
    }

    if(contentState.pageContentState["SSHMethod"] == 0)
    {
        var sshUser = document.getElementById("sshUsername");
        var sshPass = document.getElementById("sshPassword");
        var logSection = document.getElementById("logMessage");

        if(sshUser.value == "")
        {
            logSection.innerHTML = "*Name field can not be blank";
            logSection.style.display = "block";
            return 1;
        }

        if(sshPass.value == "")
        {
            logSection.innerHTML = "*Password field can not be blank";
            logSection.style.display = "block";
            return 1;
        }
        contentState.pageContentState["SSHUsername"] = sshUser.value;
        contentState.pageContentState["SSHPassword"] = sshPass.value;
    }

    else
    {
        var keyLocation = document.getElementById("keyFileInput").files[0];
        if(keyLocation == "")
        {
            logSection.innerHTML = "*Key file must be supplied";
            logSection.style.display = "block";
            return 1;
        }

        var fReader = new FileReader();
        fReader.readAsBinaryString(document.getElementById("keyFileInput").files[0]);
        contentState.pageContentState["SSHFile"] = keyLocation;
    }
    return 0;
}

var OnLoad = function(contentState)
{
    myContentState = contentState;
    sshCommandList = new Array();

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
    domainSelector.style.display = 'none';

    const yamlModule = require("js-yaml");
    totalDomainInputs = myContentState.pageContentState["DomainInputs"]; // ARRAY
    const givenMasterNode = myContentState.pageContentState["MasterNode"]; // STRING

    const fs = require('fs');
    const doc = yamlModule.load(fs.readFileSync('prometheus_template.yml', 'utf8'));

    doc.scrape_configs[0].static_configs[0].targets[0] = givenMasterNode + ":9090";
    doc.scrape_configs[3].static_configs[0].targets[0] = givenMasterNode + ":27001";

    doc.scrape_configs[1].static_configs[0].targets = new Array();
    doc.scrape_configs[2].static_configs[0].targets = new Array();
    doc.scrape_configs[4].static_configs[0].targets = new Array();

    for(var i = 0; i < totalDomainInputs.length; i++)
    {
        doc.scrape_configs[1].static_configs[0].targets.push(totalDomainInputs[i] + ":9100");
    }

    for(var i = 0; i < totalDomainInputs.length; i++)
    {
        doc.scrape_configs[2].static_configs[0].targets.push(totalDomainInputs[i] + ":8090");
    }

    for(var i = 0; i < totalDomainInputs.length; i++)
    {
        doc.scrape_configs[4].static_configs[0].targets.push(totalDomainInputs[i] + ":27002");
    }

    var sshInstance = new NodeSSH();
    const uNAME = myContentState.pageContentState["SSHUsername"];
    const password = myContentState.pageContentState["SSHPassword"];

    sshCommandList.push("sudo groupadd --system prometheus");
    sshCommandList.push("sudo useradd -s /sbin/nologin --system -g prometheus prometheus");
    sshCommandList.push("sudo mkdir /var/lib/prometheus");
    sshCommandList.push("sudo mkdir /etc/prometheus");
    sshCommandList.push("curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest \\ | grep browser_download_url \\ | grep linux-amd64 \\ | cut -d '\"' -f 4 \\ | wget -qi -");
    sshCommandList.push("tar xvf prometheus-*.tar.gz");
    sshCommandList.push("cd prometheus-*/");
    sshCommandList.push("sudo cp prometheus promtool /usr/local/bin/");
    sshCommandList.push("sudo cp -r consoles/ console_libraries/ /etc/prometheus/");
    sshCommandList.push("sudo cp prometheus-*/prometheus.yml /etc/prometheus/");
    sshCommandList.push("cat /etc/prometheus/prometheus.yml");
    sshCommandList.push("sudo chown -R prometheus:prometheus /etc/prometheus");
    sshCommandList.push("sudo chown -R prometheus:prometheus /var/lib/prometheus");
    sshCommandList.push("sudo chown prometheus:prometheus /usr/local/bin/{prometheus,promtool}");
    sshCommandList.push("sudo prometheus --config.file=/etc/prometheus/prometheus.yml");
    sshCommandList.push("sudo systemctl daemon-reload");
    sshCommandList.push("sudo systemctl enable --now prometheus");
    sshCommandList.push("sudo systemctl status prometheus");
    sshCommandList.push("sudo firewall-cmd --add-port=9090/tcp --permanent sudo");
    sshCommandList.push("sudo firewall-cmd --reload");
    
    const longGrafanaCommand = "cat <<EOF | sudo tee /etc/yum.repos.d/grafana.repo" +
    " "+
    "[grafana]"+
    "name=grafana"+
    "baseurl=https://packages.grafana.com/oss/rpm"+
    "repo_gpgcheck=1"+
    "enabled=1"+
    "gpgcheck=1"+
    "gpgkey=https://packages.grafana.com/gpg.key"+
    "sslverify=1"+
    "sslcacert=/etc/pki/tls/certs/ca-bundle.crt"+
    "EOF";

    sshCommandList.push(longGrafanaCommand);
    sshCommandList.push("sudo dnf install grafana -y");
    sshCommandList.push("sudo rpm -qi grafana");
    sshCommandList.push("sudo systemctl enable --now grafana-server.service");
    sshCommandList.push("sudo firewall-cmd --add-port=3000/tcp --permanent");
    sshCommandList.push("sudo firewall-cmd --reload");    


    var sshConfig = {
        host: givenMasterNode,
        username: uNAME,
        port: 22,
        password,
        tryKeyboard: false
    }
    
    fs.writeFileSync("prometheus.yml", yamlModule.dump(doc, {flowLevel: 5}));

    sshInstance.connect(sshConfig).then(function(){
        sshInstance.putFile("prometheus.yml", "prometheus.yml");
        for(var i = 0; i < sshCommandList.length; i++)
        {
            const commandStepper = i;
            sshInstance.execCommand(sshCommandList[commandStepper]).then(function(cmdResult){
                sshLogObject.value += cmdResult.stdout;
            });
        }
    })
    // console.log(yamlModule.dump(doc, {schema: yamlModule.JSON_SCHEMA, flowLevel: 5, forceQuotes: true}));

    // Setting up prometheus yaml

    // Do all the ssh thing
}

var exportFunctions = [PreLoad, OnLoad];

module.exports = exportFunctions;