function searchSuccess(data) {
  return function(callStatus, success) {
    success(data);
  };
}
