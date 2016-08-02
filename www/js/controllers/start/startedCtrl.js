vendorView.controller('startedCtrl',['$scope','$timeout','$localStorage','$sessionStorage','$ionicLoading',function($scope, $timeout,$localStorage,$sessionStorage,$ionicLoading){
  console.log("started controller working");
  // get details of different companies and impression used by companies from local storage array 
  //'company' and  'impressionUsedArray' respectively and then call update function 
  $scope.synchronize = function(){
    var impressionRetrieveArray=[];
    var company = [];
    company = JSON.parse(localStorage.getItem('impressionArray'));
    console.log(company);
    impressionRetrieveArray = $localStorage.impressionUsedArray;
    console.log(impressionRetrieveArray);
    var len = company.length;
    var j=0;
    $scope.update(j,len,company,impressionRetrieveArray);
    $scope.submitQuery();
    $localStorage.imageArray=[];  
    window.location = "#/start"  }
  //update the new impression values in database 
  $scope.update = function(j,len,company,impressionRetrieveArray){
    $ionicLoading.show({
        template:'Loading...'
      });
    if (j<len) {
      console.log(company,impressionRetrieveArray);
      var TabId = window.localStorage.getItem('TabId');
      firebase.database().ref('impressionDebitted/'+company[j].companyId+'/'+company[j].impressionAssignId).once('value', function(snapshot){
        console.log(j);
        console.log(company[j].companyId);
        var debitId = snapshot.val().impressionAssignId;
        //console.log(impressionRetrieveArray[j]);
        var updates = {};
        
        updates['/impressionDebitted/' + company[j].companyId + '/' + debitId + '/impressionUsed'] = impressionRetrieveArray[j];
        console.log('/impressionDebitted/' + company[j].companyId + '/' + debitId + '/impressionUsed');
        try{
          firebase.database().ref().update(updates);
          console.log('Impression Used Updated');  
        }catch(e){
         $scope.updatePrevious(company,j,impressionRetrieveArray);
         j++;
         $scope.update(j,len,company,impressionRetrieveArray);
          $ionicLoading.hide();
       }
     }).then(function(){
       $scope.updatePrevious(company,j,impressionRetrieveArray);
       j++;
       $scope.update(j,len,company,impressionRetrieveArray);
       $ionicLoading.hide();
     })
   };  
 }// checks if used impression is equal to total assigned impression or if today's date is greater than company's endDate 
 // and if true, than move that company details from current to previous path of tab campaigns and change that companies impression status to completed 
 //and delete the same company's information from current path of tab campaigns
 $scope.updatePrevious = function(company,j,impressionRetrieveArray){
  var currentDate = Math.floor(new Date().getTime()/1000);
  if( (impressionRetrieveArray[j] == company[j].impressionAssigned) || (currentDate >company[j].endDate) ){
      console.log("hello");
      //update impression status to completed
      var status = 'completed';
      var updates = {};
      console.log(company[j].impressionAssignId);
      updates['impressionDebitted/'+company[j].companyId+'/'+company[j].impressionAssignId+'/status'] = status;
      firebase.database().ref().update(updates);

      firebase.database().ref('impressionDebitted').on('child_added',function(snapshot){
        //searching for particular tabId 
        snapshot.forEach(function(data) {
          console.log(data);
          if(data.val().status == "completed" && data.val().impressionAssignId == company[j].impressionAssignId){
            $scope.debitId = data.val().impressionAssignId;            
            $scope.companyId = data.val().companyId;
            $scope.TabId = data.val().TabId;
            var debitId = data.val().impressionAssignId;

            var newcampaignkey = firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/previous').push({
              companyId : $scope.companyId,
              debitId : $scope.debitId
            }).key;
            firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/previous/' + newcampaignkey).set({
              companyId : $scope.companyId,
              debitId : $scope.debitId
            });
            console.log("UpdatedPrevious");
            console.log(debitId);
            firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/current').orderByChild('debitId').equalTo(debitId).on('child_added',function(snapshot){
              var key = snapshot.key;
              firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/current/'+key).remove();
            })
            console.log('deleted from current');
          }
        })
      })
    }
  }

  $scope.submitQuery = function(){
    var queryArray = [];
    queryArray = $localStorage.query;
    angular.forEach(queryArray, function(value){
      console.log(value);
      var newUserKey = firebase.database().ref('marketing/company/content/' + value.companyId +'/users').push().key;

      var userData = {
        userName : value.userName,
        emailId : value.userEmail,
        mobileNo : value.userMobile,
        query : value.userQuery,
        vendorId : value.vendorId,
        tabId : value.tabId,
        userId : newUserKey,
        debitId : value.debitId, 
        createdDate : value.date
      };
      console.log(userData)
      var updates = {};
      updates['marketing/company/content/' + value.companyId + '/users/' +newUserKey] = userData;
      firebase.database().ref().update(updates);
      console.log("Content Updated");
    })    
  }
}])
