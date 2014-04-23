/* 
 * Letter "O" Orbital
 * Programming Challenge for TwoPointO
 * @author: Philip Nicolcev
 * @date: Apr 22, 2014
 * 
 * Move the letter O around the screen clockwise, then to the middle.
 */

/*
 * Using the standard module design pattern, we use an IIFE to enclose
 * data and return the Orbital object with our public methods.
 */
var Orbital = (function() {
	
	
	var me = {},			// Public properties and methods are added to "me"
		_position,			// Position starting at the top of the screen
		_timer,				// SetInterval reference
		_speed,				// Time for each position in ms, defaults to 1 second = 1000 ms
		_orbiterElement;	// Contains the "o"
		
	
	/*
	 * public function init
	 * Starts the cycle of the o orbiting the page
	 * Accepts a speed in ms and a starting position
	 */
	me.init = function(element, startSpeed, startPosition) {
		_speed = startSpeed || 1000;
		_position = startPosition || 0;
		_orbiterElement = element;
	};
	
	return me;
	
})();


