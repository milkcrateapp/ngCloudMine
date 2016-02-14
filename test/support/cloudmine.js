function emptyCloudmineSuccessResponse() {
  return setCloudmineResponse({success: ''})();
};

function setCloudmineSuccessResponse(response) {
  return setCloudmineResponse({success: response});
};

function setCloudmineFailResponse(response) {
  return setCloudmineResponse({error: response});
};

function setCloudmineResultResponse(response) {
  return setCloudmineResponse({result: response});
};

function setCloudmineResponse(response) {
  var retVal;

  retVal = {
    on: function(status, func) {
      if (response[status] && response[status].length) {
        func(response[status][0], response[status][1]);
      } else if (response[status]) {
        func(response[status]);
      }

      return retVal;
    }
  };

  return function() {
    return retVal;
  };
}

function setCloudmineResponses(responses) {
  var callOn = 0;

  return function() {
    return setCloudmineResponse(responses[callOn++])();
  };
}
