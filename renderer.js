const information = document.getElementById('wowman');
const nextButton = document.getElementById('nextButton');
var x = 6;

const {NodeSSH} = require('node-ssh');
nextButton.addEventListener('click', () => {
    
    const password = '1234'
    const ssh = new NodeSSH();
    information.innerHTML = "Instance oldu";
ssh.connect({
  host: '192.168.1.25',
  //host:'centos1', //is not working Windows now.
  username: 'root',
  port: 22,
  password,
  tryKeyboard: true,
})
.then(function(){
    information.innerHTML = "Connected";

})
.then(function() {
    // Local, Remote
    ssh.putFile('C:/Users/USER/Desktop/deneme-nodessh-poleposition/poleposition/installer.sh', '/home/centos/poleposition/installer.sh').then(function() {
        information.innerHTML = "File thing is done";
    }, function(error) {
        information.innerHTML = error;
}).then(function(){
    ssh.execCommand('chmod +x ./installer.sh',{ cwd:'/home/centos/poleposition'}).then(function()
    {
        information.innerHTML = "File thing is done 2";

    }, function(error) {
        information.innerHTML = error;
    })
}).then(function(){
    ssh.execCommand('./installer.sh', { cwd:'/home/centos/poleposition' }).then(function(result) {
        //console.log('STDOUT: ' + result.stdout)
        information.innerHTML = "ok";

      })
})
})

});