function emptyCloudmineSuccessResponse() {
  return setCloudmineResponses({success: ''})();
};

function setCloudmineSuccessResponse(response) {
  return setCloudmineResponses({success: response});
};

function setCloudmineResultResponse(response) {
  return setCloudmineResponses({result: response});
};

function setCloudmineResponses(responses) {
  var response;

  response = {
    on: function(status, func) {
          if (responses[status] && responses[status].length) {
            func(responses[status][0], responses[status][1]);
          } else if (responses[status]) {
            func(responses[status]);
          }

          return response;
        }
  };

  return function() {
    return response;
  };
}
