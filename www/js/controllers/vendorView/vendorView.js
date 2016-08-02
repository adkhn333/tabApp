    // here TabId is the unique id that is assigned to each tab and it is stored in local storage during activation of tab
    // here debit Id == impressionAssignId
 vendorView.controller('vendorViewCtrl' , ['$scope','$localStorage','$sessionStorage','$timeout', '$ionicModal','$ionicHistory','$ionicSlideBoxDelegate','$ionicPopup',function($scope,$localStorage,$sessionStorage,$timeout,$ionicModal,$ionicHistory,$ionicSlideBoxDelegate,$ionicPopup){  
    console.log("vendorView controller working");
    
    // $scope.history = $ionicHistory.viewHistory();
    // if($ionicHistory.clearHistory()){
    //    console.log('history cleared');
    //    console.log($scope.history);
    // }
   
      // console.log($scope.history);

      $scope.history = Object.keys($ionicHistory.viewHistory().views).length;
      console.log($scope.history);
      if($scope.history != 1){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        console.log(Object.keys($ionicHistory.viewHistory().views).length);
      }

     $scope.history = $ionicHistory.viewHistory();
      console.log($scope.history);
    
    $localStorage.query= [];
    $localStorage.impressionUsedArray=[];
    $scope.slides = JSON.parse(localStorage.getItem('imageArray'));
    console.log($scope.slides);
    $scope.slidesLen = $scope.slides.length;
    
    var company = [];
    company = JSON.parse(localStorage.getItem('impressionArray'));
    console.log(company);

    $timeout(function(){
      $scope.tempSlides = $scope.slides[0];
      //console.log($scope.tempSlides);
      $scope.slidesLen = $scope.slides.length;
      if($scope.slidesLen == 1){
        //console.log('hii');
        $scope.slides=new Array(2);
        var len = $scope.slides.length;
        //console.log(len);
        //console.log($scope.slides);
       for(var i=0;i<len;i++){
          $scope.slides[i] = $scope.tempSlides;
          //console.log($scope.slides);
        }
      $ionicSlideBoxDelegate.update();
      }
    },500)

    $scope.slideHasChanged=function(index) {
      console.log(index);
      if($scope.slidesLen == 1){
       $scope.callImpression(0);
      } else{
        $scope.callImpression(index);
      }   
    }
    

//model functionality
    $ionicModal.fromTemplateUrl('userQuery-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

      $scope.showModal= function(imgIndex){
        console.log(imgIndex);
        $scope.imgIndex = imgIndex;
        console.log($scope.imgIndex);
        $scope.openModal();
      } 


     // save user query in database when user clicks on particular image
     $scope.updateUserQuery = function(username, useremail, usermobile, query){
      console.log("hello");
      console.log( $scope.imgIndex);
      var i =  $scope.imgIndex;
      var companyArray = [];
      companyArray = JSON.parse(localStorage.getItem('impressionArray'));
      console.log(companyArray);
      var TabId =window.localStorage.getItem('TabId');
      var vendorId =window.localStorage.getItem('vendorId');
      var DebitId = companyArray[i].impressionAssignId;
      var companyId = companyArray[i].companyId;
      var today = new Date().getTime();
     
      var query={
        userName : username,
        userEmail :useremail,
        userMobile : usermobile,
        userQuery : query,
        tabId : TabId,
        vendorId :vendorId,
        debitId : DebitId,
        companyId : companyId,
        date : today
      }   
      $localStorage.query.push(query);
      $scope.closeModal();
    }

    //function to update impressions and store updated impressions in an array in local storage
    $scope.callImpression = function(i){
      console.log(i); 
      var date = window.localStorage.getItem('date');
      var statusFlag = window.localStorage.getItem('statusFlag');
      var currentDate =  Math.floor(new Date().getTime()/86400000);
      if ((currentDate == date) && (statusFlag == 1)) {
        var currentDate= Math.floor(new Date().getTime()/1000);
        if ( (company[i].status == 'running') && (company[i].impressionAssigned > company[i].impressionUsed) ){
          console.log('true2');
          company[i].impressionUsed+=1;
          console.log(company[i].impressionUsed);
          var impressionUsed = company[i].impressionUsed;
          console.log(impressionUsed);
          $localStorage.impressionUsedArray[i] = impressionUsed;
          $localStorage.impressionUsedArray[i];

        } 
      } 
    }

    // Triggered on a button click, or some other target
    $scope.showPopup = function() {
      $scope.data = {};
      $scope.password = 1234;
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.pass">',
        title: 'Enter Exit Password',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel', 
            onTap: function(e) {
               myPopup.close(); 
            }
          },
          {
            text: '<b>Enter</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!($scope.data.pass == $scope.password)) {
                //don't allow the user to close unless he enters exit password
                e.preventDefault();
              } else {
                $scope.endDay();
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
      });

      $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
      }, 10000);
    };
     

    // function to set status flag to 0 and call sync page
    $scope.endDay = function(){
      var statusFlag = 0;
      window.localStorage.setItem('statusFlag', statusFlag);
      var currentDate = new Date().getTime();
      var date = window.localStorage.getItem('date');
      statusFlag = window.localStorage.getItem('statusFlag');
      if (statusFlag==0) {
       window.location = "#/started";
     }
    }
}])