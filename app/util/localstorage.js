import ZeroFrame from 'zeroframe';

// unfinished.. can't get around the security error for accessing sessionStorage in a sandbox

var LocalStorage = (function() {
  this.storage = {};

  window.emuStorage = {};
  window.emuStorage.removeItem = function(key) {
    this.storage[key] = undefined;
    this.saveSession();
  }.bind(this);
  window.emuStorage.getItem = function(key) {
    return this.storage[key];
  }.bind(this);

  this.saveSession = function() {
    ZeroFrame.cmd("wrapperSetstorage", this.storage);
  };
});

module.exports = new LocalStorage;
