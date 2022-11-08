const { app, BrowserWindow } = require('electron')
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 400,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      icon: './icon.png'
    })
    win.openDevTools();
    win.setResizable(false);
    win.loadFile('index.html');
    win.setMenu(null);
    
}

app.whenReady().then(() => {
    createWindow();
})
  