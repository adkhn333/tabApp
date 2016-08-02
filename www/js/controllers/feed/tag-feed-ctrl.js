app.controller("tagFeedCtrl", ['$scope', '$stateParams', '$timeout', function($scope, $stateParams, $timeout){

   $scope.tagName = $stateParams.tag;
   // console.log($scope.tagName);
   var ref = db.ref().child("tags").child($scope.tagName);
   ref.on("value", function(snapshot){
      // console.log(snapshot.val());
      console.log(snapshot.val().blogs);
      blogList = snapshot.val().blogs;
      $scope.blogArr = [];
      for(var i in blogList){
         // console.log(i); // i is the key of blogs object or the id of each blog
         var blogData = db.ref().child("blogs").child(i);
         blogData.on("value", function(snap){ //access individual blog
            console.log(snap.val());
            single_blog = snap.val();
            single_blog['tagList'] = [];
            for (var j in single_blog.tags){
               console.log(j);
               console.log(single_blog['tagList']);
               single_blog['tagList'].push(j);
            }
            $timeout(function () {
               $scope.blogArr.push(single_blog);
            }, 0);
         });
      }
   })

}]);
