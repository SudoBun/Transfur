var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'mac', 'Transfur.app', 'Contents', 'MacOS', 'Transfur');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'linux', 'Transfur');
      default:
        throw 'Unsupported platform';
    }
  }
};
