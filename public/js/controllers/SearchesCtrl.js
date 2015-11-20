app.controller('SearchesCtrl', function($scope, $http) {

	alltime();

	function alltime() {
  		$http.get("/api/searches/alltime")
  			.success(function(data) { 
  				$scope.searches = data;
  		    }
      	);
  	}

});