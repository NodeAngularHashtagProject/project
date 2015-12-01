app.controller('SearchesCtrl', function($scope, $http) {

	var searchTag;
	getAllCountries();
	$scope.country = "Denmark";
	alltime();
	trends();
	

	function alltime() {
  		$http.get("/api/searches/alltime")
  			.success(function(data) { 
  				$scope.searches = data;
  		    }
      	);
  	}

  	function trends(){
  		$http.get("/api/twitter/trends/location/" + $scope.country)
  			.success(function(data) { 
  				$scope.trends = data;
  		    }
      	);
  	}

  	function getAllCountries(){
  		$http.get("/api/twitter/trends/")
  			.success(function(data) { 
  				$scope.trendC = data;
  		    }
      	);
  	}

  	$scope.changeCountry = function() {
      if (searchTag) {
        clearTimeout(searchTag);
      }
      searchTag = setTimeout(trends, 500);
    };

}).filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});;