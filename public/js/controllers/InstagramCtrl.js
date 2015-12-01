app.controller('InstagramCtrl', function($scope, $http) {

	var searchTag;
  $scope.loading = true;
  $scope.overlay = true;

	//REMOVE THIS WHEN READY
	if($scope.search === undefined){
		$scope.search = "Copenhagen";
		$scope.count = 20;
		fetch();
	}

	$scope.change = function() {
      $scope.loading = true;
      if (searchTag) {
        clearTimeout(searchTag);
      }
      searchTag = setTimeout(fetch, 1000);

    };

  function fetch(){
    $http.get('api/posts/' + $scope.search)
      .success(function(response){
        $scope.posts = response;
        $scope.loading = false;
        $scope.overlay = false;
      });
  }

  $scope.add = function(field){
      $http.post(
      '/api/searches', 
      { txt : $scope.search}
      ).success(function(data, status){

      });
    }

});