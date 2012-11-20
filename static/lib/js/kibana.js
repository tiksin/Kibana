function KibanaCtrl($scope, $http) {
  $scope.fields = [ 'time', 'message' ]
  $scope.events = [];

  $scope.query = function() {
    $http.get('http://localhost:5601/api/search/eyJzZWFyY2giOiIiLCJmaWVsZHMiOltdLCJvZmZzZXQiOjAsInRpbWVmcmFtZSI6IjQzMjAwIiwiZ3JhcGhtb2RlIjoiY291bnQiLCJ0aW1lIjp7InVzZXJfaW50ZXJ2YWwiOjB9LCJzdGFtcCI6MTM1MzI5NTMxODg5MH0=?_=1353295319015').
      success(function(data, status, headers, config) {
        $scope.fields = get_all_fields(data)
        $scope.events = []
        $.each(data.hits.hits, function(i, v) {
          $scope.events.push(flatten_json(v['_source']))
        });
        console.log($scope.events)

        console.log('success');
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        console.log('error');
        console.log(data);
      });
  }
}
