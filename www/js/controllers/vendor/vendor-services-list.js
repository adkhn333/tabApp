vendorView.controller('VendorServicesListCtrl',[
    '$scope',
    '$timeout',
    function(
        $scope,
        $timeout){
        console.log("controller working");
    $scope.services=[
        {
            name:"Blow dry",
            value:[
            {
                id:"1",
                service:"Variable1 acc to data",
                price:"6000",
                discountprice:"600",
                added:false
            }]
        },{
            name:"Hair dry",
            value:[
            {
                id:"2",
                service:"Variable2 according to data",
                price:"6000",
                discountprice:"600",
                added:false
            },{
                id:"3",
                service:"Variable3 according to data",
                price:"6000",
                discountprice:"600",
                added:false
            },{
                id:"4",
                service:"Variable4 according to data",
                price:"6000",
                discountprice:"600",
                added:false
            }]
        },{
            name:"Hair dry",
            value:[
            {
                id:"5",
                service:"Variable acc to data",
                price:"6000",
                discountprice:"600",
                added:false
            },{
                id:"6",
                service:"Variable acc to data",
                price:"6000",
                discountprice:"600",
                added:false
            }]
        }
    ];


    $scope.selectedServices = {}; // Stores selected services
    $scope.currSlide = 0; // Current slide index

    // Get selected services if previously stored in localstorage
    if (localStorage.getItem("slectedItem") != null) {
        $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
    }
}])
