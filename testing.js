var colors = require('colors');
var emoji = require('node-emoji');
var { checkVersion } = require('./index.js');

function expect(args) {
  try {
    function toReturn(expectedRes = null, arg = args) {
      try {
        if(typeof arg !== 'undefined' || arg !== null) {
          if(expectedRes !== null) {
            if(typeof arg === typeof expectedRes) {
              if(arg === expectedRes) {
                return `Success ${emoji.get('thumbsup')}`.green;
              } else {
                return `Expect function is expecting ${arg} instead get ${expectedRes}. ${emoji.get('scream')}`.red;
              }
            } else {
              return `Expected an ${typeof arg} instead returned a ${typeof expectedRes}. ${emoji.get('scream')}`.red;
            }
          } else {
            return `Expected result must not be empty. ${emoji.get('rage')}`.red;
          }
        } else {
          return `Expect function must not be empty. ${emoji.get('rage')}`.red;
        }
      } catch(e) {
        throw new Error(e);
      }
    }
    return {
      toReturn
    }
  } catch(e) {
    throw new Error(e)
  }
}

function story(story, expect) {
  console.log(`${story} : \n\t  ${emoji.get('hammer_and_pick')}   ${expect}`);
}

story('This should return false is 2.0.0 => 2.1.0', expect(checkVersion({currentAppVersion: "2.0.0", minimumRequiredAppVersion: "2.1.0"}).updated).toReturn(false));
story('This should return false is 1.0.0 => 2.1.0', expect(checkVersion({currentAppVersion: "1.0.0", minimumRequiredAppVersion: "2.1.0"}).updated).toReturn(false));
story('This should return true is 2.5.0 => 2.1.0', expect(checkVersion({currentAppVersion: "2.5.0", minimumRequiredAppVersion: "2.1.0"}).updated).toReturn(true));
story('This should return true is 5.5.0 => 2.1.0', expect(checkVersion({currentAppVersion: "5.5.0", minimumRequiredAppVersion: "2.1.0"}).updated).toReturn(true));
story('This should return true is 2.0.0 => 2.1.0', expect(checkVersion({currentAppVersion: "2.0.0", minimumRequiredAppVersion: "2.1.0"}).updated).toReturn(false));
story('This should return true is 3.21.0 => 3.11.0', expect(checkVersion({currentAppVersion: "3.21.0", minimumRequiredAppVersion: "3.11.0"}).updated).toReturn(true));
story('This should return true is 3.8.0 => 3.8.0', expect(checkVersion({currentAppVersion: "3.8.0", minimumRequiredAppVersion: "3.8.0"}).updated).toReturn(true));
story('This should return true is 3.0.0 => 3.8.0', expect(checkVersion({currentAppVersion: "3.0.0", minimumRequiredAppVersion: "3.8.0"}).updated).toReturn(false));
