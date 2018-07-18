var Schema = require('./schema.json');

module.exports.checkVersion = function(data = {}, includePatch = false) {
  /**
    VALIDATE FUNCTION PARAMETER
  **/
  function validation(data) {
    var arr = Object.entries(data);
    var getMissignField = [];
    var getTypeError = [];

    for(var i=0; i<arr.length; i++) {
      if(typeof Schema[arr[i][0]] === 'undefined') {
        getMissignField.push(arr[i][0]);
      } else {
        if(typeof arr[i][1] !== Schema[arr[i][0]].type) {
          getTypeError.push(arr[i][0])
        }
      }
    }

    var isFields = getMissignField.length > 1 || getTypeError.length > 1 ? "fields" : "field";
    if(getMissignField.length > 0) {
      return {
        success: false,
        type: "Parameter Error",
        issue: getMissignField,
        message: `The ${isFields} "${getMissignField.join(', ')}" does not exist.`
      }
    }
    if(getTypeError.length > 0) {
      return {
        success: false,
        type: "Data type Error",
        issue: getTypeError,
        message: `The data type of the ${isFields} "${getTypeError.join(', ')}" ${getTypeError.length > 1 ? "are" : "is"} incorrect. See Schema for the proper data type.`
      }
    }
    return {
      success: true,
      type: null,
      issue: [],
      message: null
    }
  }

  function verNumberVal(stringVersion) {
    var x = stringVersion.split('.');
    var y = [...x]
    return y.join('');
  }

  /**
    CHECK WHAT CHANGES BEING MADE i.e MAJOR, MINOR OR PATCH
  **/
  function checkUnmatchVersion(data) {
    var currentAppVersion = data[Object.entries(Schema)[0][0]].split('.');
    var minimumAllowedAppVersion = data[Object.entries(Schema)[1][0]].split('.');
    // var minimumAllowedAppVersionForServer = data[Object.entries(Schema)[2][0]].split('.');
    var getUnmatchedVersion = [];

    for(var a = 0; a < currentAppVersion.length; a++) {
      for(var b = 0; b < minimumAllowedAppVersion.length; b++) {

        if(a === 0 && b === 0) { // MAJOR
          if(currentAppVersion[a] !== minimumAllowedAppVersion[b]) {
            getUnmatchedVersion.push({
              from: 'currentAppVersion',
              to: 'minimumAllowedAppVersion',
              unmatch: 'MAJOR',
              value: {
                from: parseInt(currentAppVersion[a]),
                to: parseInt(minimumAllowedAppVersion[b])
              }
            });
          }
        }
        if(a === 1 && b === 1) { // MINOR
          if(currentAppVersion[a] !== minimumAllowedAppVersion[b]) {
            getUnmatchedVersion.push({
              from: 'currentAppVersion',
              to: 'minimumAllowedAppVersion',
              unmatch: 'MINOR',
              value: {
                from: parseInt(currentAppVersion[a]),
                to: parseInt(minimumAllowedAppVersion[b])
              }
            });
          }
        }
        if(a === 2 && b === 2) { // PATCH
          if(currentAppVersion[a] !== minimumAllowedAppVersion[b]) {
            getUnmatchedVersion.push({
              from: 'currentAppVersion',
              to: 'minimumAllowedAppVersion',
              unmatch: 'PATCH',
              value: {
                from: parseInt(currentAppVersion[a]),
                to: parseInt(minimumAllowedAppVersion[b])
              }
            });
          }
        }

      }

      // for(var c = 0; c < minimumAllowedAppVersionForServer.length; c++) {
      //
      //   if(a === 0 && c === 0) { // MAJOR
      //     if(currentAppVersion[a] !== minimumAllowedAppVersionForServer[c]) {
      //       getUnmatchedVersion.push({
      //         from: 'currentAppVersion',
      //         to: 'minimumAllowedAppVersionForServer',
      //         unmatch: 'MAJOR',
      //         value: {
      //           from: parseInt(currentAppVersion[a]),
      //           to: parseInt(minimumAllowedAppVersionForServer[c])
      //         }
      //       });
      //     }
      //   }
      //   if(a === 1 && c === 1) { // MINOR
      //     if(currentAppVersion[a] !== minimumAllowedAppVersionForServer[c]) {
      //       getUnmatchedVersion.push({
      //         from: 'currentAppVersion',
      //         to: 'minimumAllowedAppVersionForServer',
      //         unmatch: 'MINOR',
      //         value: {
      //           from: parseInt(currentAppVersion[a]),
      //           to: parseInt(minimumAllowedAppVersionForServer[c])
      //         }
      //       });
      //     }
      //   }
      //   if(a === 2 && c === 2) { // PATCH
      //     if(currentAppVersion[a] !== minimumAllowedAppVersionForServer[c]) {
      //       getUnmatchedVersion.push({
      //         from: 'currentAppVersion',
      //         to: 'minimumAllowedAppVersionForServer',
      //         unmatch: 'PATCH',
      //         value: {
      //           from: parseInt(currentAppVersion[a]),
      //           to: parseInt(minimumAllowedAppVersionForServer[c])
      //         }
      //       });
      //     }
      //   }
      //
      // }
    }

    return getUnmatchedVersion;
  }

  function isUpdateNeeded(unmatchedVersions, data) {
    var getMajorChanges = [];
    var getMinorChanges = [];
    // var getPatchChanges = [];
    for(var unmv=0; unmv<unmatchedVersions.length; unmv++) {

      if(unmatchedVersions[unmv].unmatch === 'MAJOR') {
        if(unmatchedVersions[unmv].value.from < unmatchedVersions[unmv].value.to) {
          getMajorChanges.push({with: unmatchedVersions[unmv].to, changes: 'MAJOR'});
        }
      }
      if(unmatchedVersions[unmv].unmatch === 'MINOR') {
        if(unmatchedVersions[unmv].value.from < unmatchedVersions[unmv].value.to) {
          getMinorChanges.push({with: unmatchedVersions[unmv].to, changes: 'MINOR'});
        } else {
          for(var miv=0; miv<getMajorChanges.length; miv++) {
            if(getMajorChanges[miv].with === unmatchedVersions[unmv].to) {
              getMinorChanges.push({with: unmatchedVersions[unmv].to, changes: 'MINOR'});
            }
          }
        }
      }
      // if(unmatchedVersions[unmv].unmatch === 'PATCH' && unmatchedVersions[unmv].value.from < unmatchedVersions[unmv].value.to) {
      //   getPatchChanges.push({with: unmatchedVersions[unmv].to, changes: 'PATCH'});
      // }
    }

    // if(!includePatch) {
    //   if(getMajorChanges.length > 0 || getMinorChanges.length > 0) {
    //     return {
    //       updated: false,
    //       incompatible: [...getMajorChanges, ...getMinorChanges],
    //     }
    //   } else {
    //     return {
    //       updated: true,
    //       incompatible: [...getMajorChanges, ...getMinorChanges],
    //     }
    //   }
    // } else {
    //   if(getMajorChanges.length > 0 || getMinorChanges.length > 0 || getPatchChanges.length > 0) {
    //     return {
    //       updated: false,
    //       incompatible: [...getMajorChanges, ...getMinorChanges, ...getPatchChanges],
    //     }
    //   } else {
    //     return {
    //       updated: true,
    //       incompatible: [...getMajorChanges, ...getMinorChanges, ...getPatchChanges],
    //     }
    //   }
    // }
    if(getMajorChanges.length > 0 || getMinorChanges.length > 0) {
      return {
        updated: false,
        incompatible: [...getMajorChanges, ...getMinorChanges],
      }
    } else {
      return {
        updated: true,
        incompatible: [...getMajorChanges, ...getMinorChanges],
      }
    }
  }

  if(Object.keys(data).length > 0) {
    if(validation(data).success) {
      if(checkUnmatchVersion(data).length > 0) {
        return isUpdateNeeded(checkUnmatchVersion(data), data);
      } else {
        return {
          updated: true,
          incompatible: []
        }
      }
    } else {
      console.log(validation(data));
      return validation(data);
    }
  } else {
    console.log("Data is required");
    return "Data is required";
  }
}
