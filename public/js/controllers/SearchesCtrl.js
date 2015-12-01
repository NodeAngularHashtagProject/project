app.controller('SearchesCtrl', function($scope, $http) {

	$scope.country = "Canada";
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
  				$scope.trends = data[0];
  		    }
      	);
  	}

});