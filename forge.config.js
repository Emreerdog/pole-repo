module.exports = {
  
  rebuildConfig: {},
  config: {
    forge: {
        packagerConfig: {
            icon: 'C:\\Users\\kerem\\Desktop\\polepos\\pole-repo\\life.ico'
        }
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
