app.controller('InstagramCtrl', function($scope, $http) {

	var searchTag;

	//REMOVE THIS WHEN READY
	if($scope.search === undefined){
		$scope.search = "Hashatagdev";
		$scope.count = 20;
		fetch();
	}

	$scope.change = function() {
      if (searchTag) {
        clearTimeout(searchTag);
      }
      searchTag = setTimeout(fetch, 500);

    };

	function fetch() {
  		$http.jsonp("https://api.instagram.com/v1/tags/" 
        + $scope.search + 
          "/media/recent?client_id=d05f22027bd5451dbe9ac35b29526c7f&count=" 
            + $scope.count + 
              "&callback=JSON_CALLBACK")
  				.success(function(response) { 
  					$scope.items = response.data;
  		    }
      );

  		$http.jsonp("https://api.instagram.com/v1/tags/" 
          + $scope.search + 
            "/media/recent?client_id=d05f22027bd5451dbe9ac35b29526c7f&count=" 
              + $scope.count + 
                "&callback=JSON_CALLBACK")
     	.success(function(response){
        $scope.related = response;
      }
    );
  }

  $scope.add = function(field){
      $http.post(
      '/api/searches', 
      { txt : $scope.search}
      ).success(function(data, status){

      });
    }

});