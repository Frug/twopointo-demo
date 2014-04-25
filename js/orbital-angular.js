'use strict';

var app = angular.module( "Orbit", [ "ngResource" ] );

app.controller(
	"orbController",
	function( $scope, $interval, $resource ) {
		
		// Private variables
		var theTimer,
			position = 0,
			theElement,
			orbYPosition,
			orbXPosition;
			
		// Variables available to the controller scope
		$scope.debounce = false;
		$scope.timerDelay = 1000;
		$scope.orbContent = "O";
		$scope.windowHeight = 0;
		$scope.windowWidth = 0;
		
		$scope.clockPositions = [ 0, (Math.PI/6).toFixed(2), (Math.PI/3).toFixed(2), (Math.PI/2).toFixed(2) ];
		
		/*
		 * Send a function to useDebounce to prevent it from being fired to quickly.
		 * This is useful for resize events that fire too often in browsers.
		 */
		$scope.useDebounce = function(callback) {
			if ($scope.debounce === false) {
				$scope.debounce = true;

				setTimeout(function() {
					callback();
					$scope.debounce = false;
				}, 100);
			}
		};
		
		/*
		 * Move the position of the orbiter 1 place, calculate and apply its new properties.
		 */
		$scope.moveOrbiter = function() {
			position++;
			$scope.calculateOrbProperties();
			$scope.assignOrbProperties();
		};
		$scope.calculateOrbProperties = function() {
			if (position > 11) {
				position = 0;
				$scope.orbContent += "O";
			}
			$scope.calculateOrbPosition();
		};
		$scope.assignOrbProperties = function() {
			theElement.css('top', orbYPosition + 'px');
			theElement.css('right', orbXPosition + 'px');
			theElement.html($scope.orbContent);
		};
		
		$scope.calculateOrbPosition = function() {
			console.log($scope.windowHeight);
			var positionYPercent = (1 - Math.cos(position*Math.PI/6))/2,
				positionXPercent = (1 - Math.sin(position*Math.PI/6))/2;
			orbYPosition = (($scope.windowHeight - theElement[0].offsetHeight) * positionYPercent);
			orbXPosition = (($scope.windowHeight - theElement[0].offsetWidth) * positionXPercent);
		};
		
		/*
		 * Create a setInterval that moves the orbiter around, pausing each step for timerDelay
		 */
		$scope.startAnimating = function(element) {
			theElement = element;
			$scope.calculateOrbPosition();
			$scope.assignOrbProperties();
			theTimer = $interval($scope.moveOrbiter, $scope.timerDelay);
			
		};
		
	}
);

app.directive(
	'orbital',
	function($window) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				/*
				 * Pass the orbital element to the controller to start animating it.
				 */
				scope.startAnimating(element);
			}
		};
	}
);

app.directive(
	'square',
	function($window) {
		return {
			restrict: 'A',
			controller: function($scope, $element) {
				/*
				 * Detect the viewport dimensions and set the square to the maximum with or height that fits.
				 */
				$scope.onResizeFunction = function() {
					$scope.windowHeight = $window.innerHeight;
					$scope.windowWidth = $window.innerWidth;
					$scope.fitDimension = $scope.windowHeight > $scope.windowWidth ? $scope.windowWidth : $scope.windowHeight;
					$element.css( {
						height: $scope.fitDimension + 'px',
						width: $scope.fitDimension + 'px',
						'border-radius': $scope.fitDimension + 'px'
					});
				};
				// Call the resizeFunction when the page is first loaded
				$scope.onResizeFunction();
				// Bind the resizeFunction to the window's resize event.
				angular.element($window).bind('resize', function() {
					$scope.onResizeFunction();
					$scope.$apply();
				});
			}
		};
	}
);