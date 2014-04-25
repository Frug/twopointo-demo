'use strict';

var app = angular.module( "Orbit", [ "ngResource" ] );

app.controller(
	"orbController",
	function( $scope, $interval, $resource ) {
		
		var theTimer,
			position = 0,
			theElement;
	
		$scope.timerDelay = 1000;
		$scope.orbContent = "O";
		$scope.orbClass = 'orb0';
		
		$scope.moveOrbiter = function() {
			position++;
			
			$scope.calculateOrbProperties();
			$scope.assignOrbProperties();
		};
		
		$scope.calculateOrbProperties = function() {
			if (position > 4) {
				position = 0;
				$scope.orbContent += "O";
			}
			$scope.orbClass = 'orb' + position;
		};
		
		$scope.assignOrbProperties = function() {
			theElement.html($scope.orbContent);
			theElement.attr('class', $scope.orbClass);
		};
		
		$scope.startAnimating = function(element) {
			theElement = element;
			$scope.assignOrbProperties();
			theTimer = $interval($scope.moveOrbiter, $scope.timerDelay);
			
		};
		
	}
);

app.directive(
	'orbital',
	function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				scope.startAnimating(element);
			}
		};
});