angular
  .module('momentum.petition', ['ngLodash']);
angular
  .module('momentum.petition')
  .controller('petitionCtrl', petitionCtrl);

petitionCtrl.$inject = ['$scope', 'Petition', 'lodash', '$rootScope'];
  
function petitionCtrl( $scope, Petition, lodash, $rootScope ) {
    
    var vm = this;

    vm.feed = function() {
      Petition.feed(vm.campaignId, vm.actionId)
        .success(function(data) {
          vm.petitions = data;
        })
    }

    vm.create = function() {
      Petition.create(vm.actionId, vm.newpetition)
        .success(function(data) {
          $rootScope.$broadcast('newPetition', data);
          vm.newpetition = {};
          // $scope.createForm.$setPristine();
          // $alert({ content: "Action created successfully" });
        });
    }
  
}


angular
  .module('momentum.petition')
  .factory('Petition', Petition);

Petition.$inject = ['$http'];

function Petition($http) {

    var root = 'http://localhost:1337';

    return {
      info: info,
      create: create,
      feed: feed,
      // campaign: campaign,
      // all: all
    };

    function info(campaignId, actionId) {
        return $http.get(root + '/campaign/' + campaignId + '/action/' + actionId);
    }

    function create(actionId, record) {
        return $http.post(root + '/petition/' + actionId, record);
    }

    function feed(campaignId, actionId) {
        return $http.get(root + '/campaign/' + campaignId + '/action/' + actionId + '/feed');
    }

    // function campaign(id) {
    //     return $http.get('/petition/' + id + '/campaign');
    // }

    // function all(id) {
    //     return $http.get('/petition/' + id + '/all');
    // }

}
angular.module("momentum.petition").run(["$templateCache", function($templateCache) {$templateCache.put("/directives/feed.html","<div data-ng-repeat=\"petition in pc.petitions | orderBy:\'-createdAt\'\" class=\"petitionItem\"><p><b>{{ petition.first_name }} said</b> {{ petition.message}}<small class=\"clearfix\">at {{ petition.createdAt | date : \'medium\' }}</small></p></div>");
$templateCache.put("/directives/form.html","<form id=\"petitionForm\" data-ng-submit=\"pf.create()\"><div class=\"form-group\"><input type=\"text\" data-ng-model=\"pf.newpetition.first_name\" data-ng-required=\"true\" placeholder=\"First Name\" class=\"form-control\"/></div><div class=\"form-group\"><textarea data-ng-model=\"pf.newpetition.message\" data-ng-required=\"true\" placeholder=\"Message\" class=\"form-control\"></textarea></div><button class=\"btn btn-success btn-block btn-lg\">Sign Petition</button></form>");}]);
angular
    .module('momentum.petition')
    .directive('petitionFeed', petitionFeed);

function petitionFeed() {
   
  return {
    restrict: 'E',
    bindToController: true,
    controller : 'petitionCtrl as pc',
    replace: true,
    templateUrl: '/directives/feed.html',
    scope: {
      campaignId: "@",
      actionId: "@",
    },  
    link: link
  };

  function link(scope, element, attr, ctrl) {
    ctrl.newpetition = {};
    ctrl.petitions = [];
    ctrl.feed();

    // Listern for new petition and add to records
    scope.$on('newPetition', function(event, data) { 
      ctrl.petitions.push(data);
    });
  }

}
angular
    .module('momentum.petition')
    .directive('petitionForm', petitionForm);

function petitionForm() {
   
  return {
    restrict: 'E',
    bindToController: true,
    controller : 'petitionCtrl as pf',
    replace: true,
    templateUrl: '/directives/form.html',
    scope: {
      actionId: "@"
    },
    link: link
  };

  function link(scope, element, attr, ctrl) {
    ctrl.newpetition = {};
  }

}