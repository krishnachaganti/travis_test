var technikFDAApp = angular.module('technikFDAApp', []);

//  Force AngularJS to call our JSON Web Service with a 'GET' rather than an 'OPTION'
//  Taken from: http://better-inter.net/enabling-cors-in-angular-js/
technikFDAApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

technikFDAApp.filter('sumByKey', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }
        return sum;
    };
})

technikFDAApp.filter('customSum', function () {
    return function (listOfProducts, key) {
        //  Count how many items are in this order
        var total = 0;
        angular.forEach(listOfProducts, function (product) {
            //            alert(product + "." + key);
            total += eval("product." + key);
        });
        return total;
    }
});

technikFDAApp.filter('countItemsInOrder', function () {
    return function (listOfProducts) {
        //  Count how many items are in this order
        var total = 0;
        angular.forEach(listOfProducts, function (product) {
            total += product.Quantity;
        });
        return total;
    }
});

technikFDAApp.filter('orderTotal', function () {
    return function (listOfProducts) {
        //  Calculate the total value of a particular Order
        var total = 0;
        angular.forEach(listOfProducts, function (product) {
            total += product.Quantity * product.UnitPrice;
        });
        return total;
    }
});

technikFDAApp.controller('MasterDetailCtrl',
function ($scope, $http) {

    //  We'll load our list of Customers from our JSON Web Service into this variable
    $scope.listOfCustomers = null;

    //  When the user selects a "Customer" from our MasterView list, we'll set the following variable.
    $scope.selectedCustomer = null;

    $http.get('http://localhost:8080/technikfda/query/countries')

        .success(function (data) {
            $scope.countries = data;

            if ($scope.countries.length > 0) {

                //  If we managed to load more than one Customer record, then select the first record by default.
                //  This line of code also prevents AngularJS from adding a "blank" <option> record in our drop down list
                //  (to cater for the blank value it'd find in the "selectedCustomer" variable)
                $scope.selectedCountry = $scope.countries[0].term;

                //  Load the list of Orders, and their Products, that this Customer has ever made.
                $scope.loadIncidents();
            }
        })
        .error(function (data, status, headers, config) {
            $scope.errorMessage = "Couldn't load the list of customers, error # " + status;
        });

    $scope.selectCountry = function (val) {
        //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
        $scope.selectedCountry = val.term;
        $scope.loadIncidents();
    }

    $scope.loadIncidents = function () {
        //  Reset our list of Incidents  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
        $scope.listOfIncidents = null;

        //  The user has selected a Customer from our Drop Down List.  Let's load this Customer's records.
        $http.get('http://localhost:8080/technikfda/query/countryCode/US/limit/10/skip/20')
                .success(function (data) {
                    $scope.listOfIncidents = data.results;
                })
                .error(function (data, status, headers, config) {
                    $scope.errorMessage = "Couldn't load the list of Incidents, error # " + status;
                });
    }
});
