(function () {
  'use strict';

  var app = angular.module('swipe.example', ['awesome-angular-swipe']);

  app.controller('swipeCtrl', function ($scope, $timeout) {
    $scope.swipeAction = 'idle';
    function _idle() {
      $scope.swipeClose();
      $scope.$apply(function() {
        $scope.swipeAction = 'idle';
      });
    }

    $scope.onSwipeLeft = function() {
      $scope.$apply(function() {
        $scope.swipeAction = 'swipe left';
      });
      $timeout(_idle, 1000);
    };
    $scope.onSwipeRight = function() {
      $scope.$apply(function() {
        $scope.swipeAction = 'swipe right';
      });
      $timeout(_idle, 1000);
    };

    $scope.delayedClose = function() {
      $timeout($scope.swipeClose, 1000);
    }
  });

  app.controller('fancySwipeCtrl', function ($scope, $timeout) {
    $scope.delayedClose = function() {
      $timeout($scope.swipeClose, 1000);
    }
  });

})();
