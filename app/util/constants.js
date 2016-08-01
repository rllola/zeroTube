import content from '../../content.json'

var Constants = (function() {
  /*
    Would be great if we could automatically retrieve the APP_ID
    in the content.json file.
  */
  this.APP_ID = content.address;
});

module.exports = new Constants;
