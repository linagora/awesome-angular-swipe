(function() {
  'use strict';

  function awesomeAngularSwipe(angular) {

    return angular.module('awesome-angular-swipe', ['ngTouch'])
      .run(['$templateCache', function($templateCache) {
        $templateCache.put(
          'templates/leftTemplate.html',
          '<div class="option-item"><i class="mdi mdi-check" /></div>'
        );
        $templateCache.put(
          'templates/rightTemplate.html',
          '<div class="option-item"><i class="mdi mdi-apps" /></div>'
        );
      }])

      .directive('swipe', ['$timeout', '$swipe', function($timeout, $swipe) {
        return {
          restrict: 'AC',
          transclude: true,
          template: '<div class="swipe-wrapper">' +
                      '<div ng-include="leftTemplate" class="option left"></div>' +
                      '<div ng-include="rightTemplate" class="option right"></div>' +
                      '<div class="swipe-content" ng-transclude></div>'+
                    '</div>',
          link: function(scope, element, attrs) {
            var startX = 0;
            var deltaX = 0;
            var positionX = 0;
            var transitionDuration = 200;
            var swipeWidth;
            var swipeLeft = attrs.swipeLeft && scope[attrs.swipeLeft] || angular.noop;
            var swipeRight = attrs.swipeRight && scope[attrs.swipeRight] || angular.noop;

            function init() {
              swipeWidth = element.outerWidth();
            }

            function isSwipingToLeft(coordinates) {
              return startX > coordinates.x;
            }

            function putInFrontOf(aheadElement, behindElement) {
              aheadElement.addClass('ahead').removeClass('behind');
              aheadElement.show();
              behindElement.removeClass('ahead').addClass('behind');
              behindElement.hide();
            }

            function updateTranslate3dX(x) {
              scope.changeCss(element.find('.swipe-content'), 'transform', buildTranslate3d(x, 0, 0));
              positionX = x;
            }

            function buildTranslate3d(x, y, z) {
              return 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)';
            }

            scope.swipeClose = function() {
              updateTranslate3dX(0);
              $timeout(function(){
                element.find('.option.right').hide();
                element.find('.option.left').hide();
                element.find('.swipe-content').removeClass('swipeable-color');
              }, transitionDuration);
            };

            scope.transitionSwipeLeft = function() {
              updateTranslate3dX(-swipeWidth);
            };

            scope.transitionSwipeRight = function() {
              updateTranslate3dX(swipeWidth);
            };

            // Wrapper function for easy mock in tests
            scope.changeCss = function(element, property, value) {
              if (property === 'transform') {
                element.css('-webkit-transform', value);
              }
              element.css(property, value);
            };

            scope.leftTemplate = attrs.leftTemplate || 'templates/leftTemplate.html';
            scope.rightTemplate = attrs.rightTemplate || 'templates/rightTemplate.html';

            function onStartListener(startCoordinates) {
              init();
              element.find('.swipe-content').addClass('moving');
              element.find('.swipe-content').addClass('swipeable-color');
              startX = positionX = startCoordinates.x;
            }

            function onMoveListener(currentCoordinates) {
              deltaX = currentCoordinates.x - startX;
              if (isSwipingToLeft(currentCoordinates)) {
                putInFrontOf(element.find('.option.right'), element.find('.option.left'));
              } else {
                putInFrontOf(element.find('.option.left'), element.find('.option.right'));
              }
              updateTranslate3dX(deltaX);
            }

            function onEndListener(endCoordinates) {
              deltaX = endCoordinates.x - startX;
              element.find('.swipe-content').removeClass('moving');
              if (isSwipingToLeft(endCoordinates)) {
                if (deltaX < 0 && Math.abs(deltaX) > swipeWidth / 3.0) {
                  scope.transitionSwipeLeft();
                  swipeLeft();
                } else {
                  scope.swipeClose();
                }
              } else {
                if (deltaX > 0 && Math.abs(deltaX) > swipeWidth / 3.0) {
                  scope.transitionSwipeRight();
                  swipeRight();
                } else {
                  scope.swipeClose();
                }
              }
            }

            $swipe.bind(element, {
              start: onStartListener,
              move: onMoveListener,
              end: onEndListener,
              cancel: scope.swipeClose
            }, ['touch']);
          }
        };
      }]);
  }

  awesomeAngularSwipe(angular);
})();
