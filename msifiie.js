const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64", 
const APP_DIR = "C:\\Users\\Mavi\\Desktop\\Projects\\pole-repo\\out\\poleposition-remastered-win32-x64"
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = "C:\\Users\\Mavi\\Desktop\\Projects\\msitryer"

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configure metadata
    description: 'Poleposition remote installer',
    exe: 'poleposition-remastered',
    name: 'Poleposition Remote Installer',
    manufacturer: 'BEARtell',
    version: '1.0.0',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true,
        images: {
            background: "C:\\Users\\Mavi\\Desktop\\Projects\\pole-repo\\bearlogo.jpg"
        }
    },
});

// 4. Create a .wxs template file
msiCreator.create().then(function(){

    // Step 5: Compile the template to a .msi file
    msiCreator.compile();
});