<?php
/* 
 * A simple JSON web service to store and retreive the position of the "o" in the
 * orbital demo.
 */
error_reporting(E_ALL);
session_start();

class Orbital_Service {
	const MAX_POSITION = 11;
	private $position;
	private $json_response;
	
	/**
	 * Save the given position in a session and return the set position as json
	 */
	public function save_position() {
		$post_data = json_decode(file_get_contents('php://input'), true);
		
		if (!isset($post_data['position']) || !is_numeric($post_data['position']) || (integer)$post_data['position'] > self::MAX_POSITION) {
			$position = 0;
		} else {
			$position = $post_data['position'];
		}

		$_SESSION['position'] = $position;
		
		$this->json_response = json_encode(array('status' => (integer)$position));
	}
	
	/**
	 * Echo the json encoded position
	 */
	public function get_position_json() {
		if (isset($_SESSION['position'])) {
			$this->position = $_SESSION['position'];
		} else { 
			$this->position = 0;
		}
		
		$this->json_response = json_encode(array('position' => (integer)$this->position));
	}
	
	/**
	 * Call save or get as needed, and output a json response.
	 */
	public function handle_request() {
		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			$this->save_position();
		} else {
			$this->get_position_json();
		}
		
		header('Content-type: application/json; charset=utf-8');
		echo $this->json_response;
	}
	
}

/*
 * Use the above orbital_service class. Move this to a new file if desired.
 */
$oservice = new Orbital_Service();
$oservice->handle_request();