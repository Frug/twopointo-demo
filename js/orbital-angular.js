'use strict';

var app = angular.module( "Orbit", [ "ngResource" ] );

/*
 * controller 'orbController'
 * 
 * Our main controller, this will handle animating an O within a clock face and saving its position to a service.
 * This controller should contain two directives within its scope:
 * - an 'orbital' directive that should call orbController's startAnimating and pass an element to animate.
 * - a 'square' directive that should set windowHeight and windowWidth and adjust these values when the viewport is resized.
 */
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
		$scope.timerDelay = 1000;
		$scope.orbContent = "O";
		$scope.windowHeight = 0;
		$scope.windowWidth = 0;
		
		// External resource for getting/saving the orbiter's position
		$scope.serviceResource = $resource(
			'orbital-service.php', 
			{}
		);
		
		/*
		 * Initlialize the orbiter with an element taken from a directive.
		 * Pull its most recent position from the json service and create a setInterval
		 * that moves the orbiter around, pausing each step for timerDelay
		 */
		$scope.startAnimating = function(element) {
			theElement = element;
			$scope.serviceResource.get({}, function(resp) {
				position = resp.position;
				$scope.calculateOrbCoordinates();
				$scope.assignOrbProperties();
				theTimer = $interval($scope.moveOrbiter, $scope.timerDelay);
			});
		};
		
		/*
		 * Move the position of the orbiter 1 place, calculate and apply its new properties.
		 * Save its new position to the json service.
		 */
		$scope.moveOrbiter = function() {
			position++;
			if (position > 11) {
				position = 0;
				$scope.orbContent += "O";
			}
			$scope.calculateOrbCoordinates();
			$scope.assignOrbProperties();
			$scope.savePosition();
		};
		
		/*
		 * Use some trig to find the x and y position of the orbiter around a circle based on position
		 */
		$scope.calculateOrbCoordinates = function() {
			var positionYPercent = (1 - Math.cos(position*Math.PI/6))/2,
				positionXPercent = (1 - Math.sin(position*Math.PI/6))/2;
			orbYPosition = (($scope.windowHeight - theElement[0].offsetHeight) * positionYPercent);
			orbXPosition = (($scope.windowHeight - theElement[0].offsetWidth) * positionXPercent);
		};
		
		/*
		 * Position the orbiter using its coordinates and set its inner value.
		 */
		$scope.assignOrbProperties = function() {
			theElement.css('top', orbYPosition + 'px');
			theElement.css('right', orbXPosition + 'px');
			theElement.html($scope.orbContent);
		};
		
		/*
		 * Send the orbiter's position to an external json resource.
		 */
		$scope.savePosition = function() {
			$scope.serviceResource.save({'position': position});
		};
		
	}
);

/*
 * directive 'orbital'
 * 
 * The 'orbital' directive simply passes the orbital element to the containing controller for handling.
 * It expects its containing controller to have a startAnimating() function.
 */
app.directive(
	'orbital',
	function($resource) {
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

/*
 * directive 'square'
 * 
 * The 'square' directive draws a square that fills the space available on the screen
 * It is adjusted on window resize and looks like a circle due to its CSS border-radius.
 */
app.directive(
	'square',
	function($window) {
		return {
			restrict: 'A',
			/*
			 * Use controller so this directive fires before the orbital directive
			 */
			controller: function($scope, $element) {
				$scope.debounce = false;
				
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
					$scope.useDebounce($scope.onResizeFunction);
					$scope.$apply();
				});
				
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
			}
		};
	}
);