(function() {
  'use strict';

  function awesomeAngularSwipe(angular) {

    return angular.module('awesome-angular-swipe', ['ngTouch'])
      .run(['$templateCache', function($templateCache) {
        $templateCache.put(
          '/views/modules/swipe/swipe-options.html',
          '<div class="option right"><div class="option-item all-centered"><i class="mdi mdi-apps" /></div></div>' +
          '<div class="option left"><div class="option-item all-centered"><i class="mdi mdi-apps" /></div></div>'
        );
      }])
      .directive('swipe', ['$window', '$http', '$compile', '$templateCache', '$timeout', '$swipe', function($window, $http, $compile, $templateCache, $timeout, $swipe) {
        return {
          restrict: 'AC',
          link: function(scope, element, attrs) {
            var parent = element.parent();
            var startX = 0;
            var deltaX = 0;
            var positionX = 0;
            var swipeWidth;
            var optionRight;
            var optionLeft;
            var optionItemRightWidth;
            var optionItemLeftWidth;
            var icons;
            var iconLeft;
            var iconRight;
            var maxDistanceForIconScale;
            var functionNoop = function() {};
            var stopClickPropagation = function(event) {
              event.stopImmediatePropagation();
            };
            var stopClickPropagationOnMove = functionNoop;
            var swipeLeft = functionNoop;
            var swipeRight = functionNoop;

            scope.swipeClose = function() {
              updateTranslate3dX(0);
            };

            scope.swipeLeft = function() {
              updateTranslate3dX(-swipeWidth);
            };

            scope.swipeRight = function() {
              updateTranslate3dX(swipeWidth);
            };

            if (attrs.swipeLeft) {
              swipeLeft = scope[attrs.swipeLeft];
            }
            if (attrs.swipeRight) {
              swipeRight = scope[attrs.swipeRight];
            }

            function init() {
              swipeWidth = element.outerWidth();
              maxDistanceForIconScale = swipeWidth / 4.0;
            }
            init();

            function swipeToLeft(coordinates) {
              return startX > coordinates.x;
            }

            function putInFrontOf(aheadElement, behindElement) {
              aheadElement.addClass('ahead').removeClass('behind');
              aheadElement.css('display', 'block');
              behindElement.removeClass('ahead').addClass('behind');
              behindElement.css('display', 'none');
            }

            // Wrapper function for easy mock in tests
            scope.changeCss = function(element, property, value) {
              if (property === 'transform') {
                element.css('-webkit-transform', value);
              }
              element.css(property, value);
            };

            function updateTranslate3dX(x) {
              scope.changeCss(element, 'transform', buildTranslate3d(x, 0, 0));
              positionX = x;
            }

            function buildTranslate3d(x, y, z) {
              return 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)';
            }

            function buildScale3d(x, y, z) {
              return 'scale3d(' + x + ', ' + y + ', ' + z + ')';
            }

            function onStartListener(startCoordinates) {
              element.addClass('moving');
              stopClickPropagationOnMove = stopClickPropagation;
              startX = positionX = startCoordinates.x;
            }

            function onMoveListener(currentCoordinates) {
              deltaX = currentCoordinates.x - startX;
              if (swipeToLeft(currentCoordinates)) {
                putInFrontOf(optionRight, optionLeft);
              } else {
                putInFrontOf(optionLeft, optionRight);
              }
              updateTranslate3dX(deltaX);
              var positionXAbs = Math.abs(positionX);
              if (positionXAbs < maxDistanceForIconScale) {
                var scale = positionXAbs / maxDistanceForIconScale;
                scope.changeCss(icons, 'transform', buildScale3d(scale, scale, 1));
              }
            }

            function onEndListener(endCoordinates) {
              deltaX = endCoordinates.x - startX;
              element.removeClass('moving');
              $timeout(function() {
                stopClickPropagationOnMove = functionNoop;
              }, 200);

              if (swipeToLeft(endCoordinates)) {
                if (deltaX < 0 && Math.abs(deltaX) > swipeWidth / 3.0) {
                  scope.swipeLeft();
                  swipeLeft();
                } else {
                  scope.swipeClose();
                }
              } else {
                if (deltaX > 0 && Math.abs(deltaX) > swipeWidth / 3.0) {
                  scope.swipeRight();
                  swipeRight();
                } else {
                  scope.swipeClose();
                }
              }
            }

            function onResize() {
              scope.swipeClose();
              init();
            }

            angular.element($window).resize(onResize);

            scope.$on('$destroy', function() {
              angular.element($window).off('resize', onResize);
            });

            $swipe.bind(element, {
              start: onStartListener,
              move: onMoveListener,
              end: onEndListener,
              cancel: scope.swipeClose
            }, ['touch']);

            parent.addClass('swipe-wrapper');
            $http
              .get('/views/modules/swipe/swipe-options.html', {
                cache: $templateCache
              })
              .success(function(template) {
                parent.append($compile(template)(scope));
                optionLeft = parent.find('.option.left');
                optionRight = parent.find('.option.right');
                optionItemRightWidth = optionRight.find('.option-item').width();
                optionItemLeftWidth = optionLeft.find('.option-item').width();
                icons = parent.find('.option-item i');
                iconLeft = parent.find('.option.left .option-item i');
                iconRight = parent.find('.option.right .option-item i');

                if (attrs.iconLeft) {
                  iconLeft.removeClass('mdi-apps');
                  iconLeft.addClass(attrs.iconLeft);
                }
                if (attrs.iconRight) {
                  iconRight.removeClass('mdi-apps');
                  iconRight.addClass(attrs.iconRight);
                }
              });
          }
        };
      }]);
  }

  awesomeAngularSwipe(angular, (typeof global !== 'undefined' ? global : window).interact);
})();
