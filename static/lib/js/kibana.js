var Kibana = {};
var App = angular.module('Kibana', []);

function KibanaCtrl($scope, $http) {

  $scope.fields = {};
  $scope.fields.show = [ '@timestamp', '@message' ]
  $scope.events = [];

  $scope.request = function () {
    console.log(this.query_string);
  }

  $scope.result = function() {
    $http.get('http://localhost:5601/api/search/eyJzZWFyY2giOiIiLCJmaWVsZHMiOltdLCJvZmZzZXQiOjAsInRpbWVmcmFtZSI6IjQzMjAwIiwiZ3JhcGhtb2RlIjoiY291bnQiLCJ0aW1lIjp7InVzZXJfaW50ZXJ2YWwiOjB9LCJzdGFtcCI6MTM1MzI5NTMxODg5MH0=?_=1353295319015').
      success(function(data, status, headers, config) {
        $scope.fields.available = get_all_fields(data)
        $scope.events = []
        $.each(data.hits.hits, function(i, v) {
          $scope.events.push(flatten_json(v['_source']))
        });
        console.log('success');
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
  }

  $scope.toggle_field = function(field) {
    var fa = $scope.fields.show
    if(_.indexOf(fa,field) < 0)
      fa.push(field);
    else
      fa = _.without(fa,field);
    $scope.fields.show = fa;
  }

  $scope.selected_field = function(field) {
    return _.indexOf($scope.fields.show,field) > -1 ? true : false;
  }

}

// Doesn't work, can't have html in return
angular.module('filters', []).
  filter('wbr', function () {
    return function (text, length) {
      if (isNaN(length))
        length = 10;
      if(_.isString(text)) {
        return text.replace(RegExp("(\\w{" + length + "}|[:;,])([\\w\"'])", "g"),
        function (all, text, char) {
          return text + "<del>&#8203;</del>" + char;
        });
      } else {
        return text;
      }
    };
  }
)
/*
  .
  filter('san_xml' function () {
    return function (text, length, end) {
      if (isNaN(length))
        length = 10;

      if (end === undefined)
        end = "...";

      if (text.length <= length || text.length - end.length <= length) {
        return text;
      }
      else {
        return String(text).substring(0, length-end.length) + end;
      }
    };
  }
)
*/
