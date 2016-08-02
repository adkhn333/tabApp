
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var vendorView = angular.module('vendorView', ['ionic','ngStorage','ngCordova','ngTouch'])

vendorView.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

vendorView.config(function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.otherwise("/indexView.html");
  $stateProvider
  .state('vendorView', {
    cache: false,
    url: '/vendorView',
    templateUrl: 'templates/vendorView.html',
    controller:'vendorViewCtrl'
  })
  .state('activate', {
    cache: false,
    url: '/activate',
    templateUrl: 'templates/activate.html',
    controller: 'vendorAppCtrl'
  })
  .state('start', {
    cache: false,
    url: '/start',
    templateUrl: 'templates/start.html',
    controller: 'startCtrl'
  })
  .state('started', {
    cache: false,
    url: '/started',
    templateUrl: 'templates/started.html',
    controller: 'startedCtrl'
  })
  //menu
  .state('vendorView.menu', {
    cache: false,
    url: '/menu',
    views: {
      'menu': {
        templateUrl: 'templates/vendor-services-list.html',
        controller: 'VendorServicesListCtrl'
      }
    }
  })
  //gallery
  .state('vendorView.gallery', {
    cache: false,
    url: '/gallery',
    views: {
      'gallery': {
        templateUrl: 'templates/vendorDetails.html',
        controller: 'VendorDetailsCtrl'
      }
    }
  })
  //fabBook
  .state('vendorView.fabBook', {
    cache: false,
    url: '/feed',
    views: {
      'feed': {
        templateUrl: 'templates/feed.html',
        controller: 'FeedCtrl'
      }
    }
  })
  //review
  .state('vendorView.reviews', {
    cache: false,
    url: '/reviews',
    views: {
      'reviews': {
       templateUrl: 'templates/reviews.html',
       controller: 'reviewCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise(function($injector){
   var state = $injector.get('$state');
   var statusFlag = window.localStorage.getItem('statusFlag');
   var vendorId = window.localStorage.getItem('vendorId');
   var tab = window.localStorage.getItem('TabId');
   console.log(vendorId,tab,statusFlag);
   if((vendorId!=null) && (tab!=null) && (statusFlag == 0)){
    state.go('start');
   }
   else if( (vendorId==null) && (tab==null) && (statusFlag ==null)){
     state.go('activate');
   }
   else{
     state.go('vendorView');
    }  
});
})

