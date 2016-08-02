vendorView.controller('startCtrl',['$scope','$localStorage','$sessionStorage','$timeout','$ionicLoading','$cordovaFileTransfer',function($scope,$localStorage,$sessionStorage,$timeout,$ionicLoading,$cordovaFileTransfer){
        
    console.log("start controller working");
    $scope.date = new Date();
    $scope.companyDetails = [];
    $scope.companyNum = 0;
    $scope.imageArray = [];
     $scope.getCompany = function() {
      // Start showing the progress
      $localStorage.imageArray = [];
      var impressionArray=[];
      var company=[];
      var tabId = window.localStorage.getItem('TabId');
      //console.log(tabId);
      firebase.database().ref('tabCampaign/'+tabId+'/campaigns/current').once('value', function(snapshot){
        //console.log(snapshot.val());
        $scope.companies = snapshot.val();
        $scope.companyNum = snapshot.numChildren();
        console.log($scope.companyNum);
      }).then(function(){
        //console.log($scope.companies);
        angular.forEach($scope.companies, function(value, key){
          $scope.getImpressions(value);
        })
      })
      //fetch company Id and Debit Id from current path of tabcampaigns
    //   firebase.database().ref('tabCampaign/'+tabId+'/campaigns/current/').once('value', function(snapshot){
    //     $scope.objectNo = snapshot.numChildren();
    //     $scope.count =0;
    //     snapshot.forEach(function(data){
    //       console.log("hii");
    //       console.log(data);
    //       var currentCompanyId = data.val().companyId;
    //       var debitId = data.val().debitId;//debitId of tabCampaigns object is same as impressionAssignId of impressionDebitted object
    //       //retrive laa data of company from impressionDebitted Object for a particular debitId
    //       firebase.database().ref('impressionDebitted/'+currentCompanyId+'/'+debitId).once('value',function(snapshot){
    //        if(snapshot.val().status == 'running'){
    //          var companyId = snapshot.val().companyId;
           
    //          var impressionObj= { }
    //          impressionObj = snapshot.val();
    //          console.log(impressionObj);
    //          impressionArray.push(impressionObj);
    //          console.log(impressionArray);
    //          window.localStorage.setItem("impressionArray", JSON.stringify(impressionArray));
    //          //get image url for a particular companyId and save it in localstorage
    //          firebase.database().ref('marketing/company/content/'+companyId).once('value',function(snapshot){
    //             imageObj={
    //              url:"",
    //             }
    //              imageObj.url= snapshot.val().imageLink; 
    //          //    var imageObj={
    //          //     targetPath:"",
    //          //    }
    //          //    var url= snapshot.val().imageLink; 
    //          //   // var img = new Image();     
               
    //          // imageObj.targetPath = cordova.file.externalRootDirectory + url.split('/')[url.split('/').length-1];
    //          // var trustHosts = true;
    //          // var options = {};
              

    //          // $cordovaFileTransfer.download(url, imageObj.targetPath, options, trustHosts)
    //          // .then(function(result) {
    //          //      // Success!
    //          //      $scope.src = result.nativeURL;
    //          //      $scope.status = JSON.stringify(result.nativeURL);
    //          //    }, function(err) {
    //          //      // Error
    //          //      $scope.status = JSON.stringify(err);
    //          //    }, function (progress) {
    //          //      $timeout(function () {
    //          //        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
    //          //      });
    //          //    });
    //           $localStorage.imageArray.push(imageObj);
    //             console.log($localStorage.imageArray);
    //           })
    //           $scope.count++;
    //           console.log($scope.count);
    //           console.log($scope.objectNo);
    //           if($scope.count == $scope.objectNo){
    //            $scope.getMyPage();
    //           }
    //         };
    //       })
          
    //     })
    // })
    }

    $scope.getImpressions = function(value){
      //console.log(value);
      firebase.database().ref('impressionDebitted/'+value.companyId+'/'+value.debitId).once('value', function(snapshot){
        //console.log(snapshot.val());
        $scope.companyDetails.push(snapshot.val());
        console.log($scope.companyDetails);
        if($scope.companyDetails.length == $scope.companyNum){
          $scope.getUrls();
        }
      }).then(function(){
        console.log($scope.companyDetails.length);
        
      })
    }
    $scope.getUrls = function(){
      console.log($scope.companyDetails);
      angular.forEach($scope.companyDetails, function(value, key){
          firebase.database().ref('marketing/company/content/'+value.companyId).once('value', function(snapshot){
            console.log('hii');
            //console.log(value);
            //console.log(snapshot.val());
            // var url= snapshot.val().imageLink; 
            // var imageObj={
            //      targetPath:"",
            //     }
            //  imageObj.targetPath = cordova.file.externalRootDirectory + url.split('/')[url.split('/').length-1];
            //  var trustHosts = true;
            //  var options = {};
            //  $cordovaFileTransfer.download(url, imageObj.targetPath, options, trustHosts)
            //  .then(function(result) {
            //       // Success!
            //       $scope.src = result.nativeURL;
            //       $scope.status = JSON.stringify(result.nativeURL);
            //     }, function(err) {
            //       // Error
            //       $scope.status = JSON.stringify(err);
            //     }, function (progress) {
            //       $timeout(function () {
            //         $scope.downloadProgress = (progress.loaded / progress.total) * 100;
            //       });
            //     });
              $scope.imageArray.push(snapshot.val());
            //console.log($scope.imageArray);
          }).then(function(){
            if($scope.imageArray.length == $scope.companyNum){
              console.log($scope.imageArray.length);
              console.log($scope.companyNum);
              window.localStorage.setItem("impressionArray", JSON.stringify($scope.companyDetails));
              window.localStorage.setItem("imageArray", JSON.stringify($scope.imageArray));
              //console.log(JSON.parse(localStorage.getItem('impressionArray')));
              //console.log(JSON.parse(localStorage.getItem('imageArray')));
              $scope.getMyPage();
            }
          })
      });
    }

    $scope.getMyPage=function(){
      $ionicLoading.hide();  
       // status flag needed to be set to 1 inorder to redirect to vendorView page 
      console.log("ontime");
      var statusFlag = 1;
      window.localStorage.setItem('statusFlag', statusFlag);
      var currentDate= Math.floor(new Date().getTime()/86400000);
      window.localStorage.setItem('date', currentDate);
      window.location= "#/vendorView";
    }

     $scope.startDay = function(){
      $ionicLoading.show({
        template:'Loading...'
      });
      $scope.getCompany();
    }
}])
