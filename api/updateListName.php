<?php
// Uncomment if you need to have detailed error reporting
error_reporting(E_ALL);

// Include the Handler class so we can use it. 
require("helpers/handler.php");

// Create a new request handler. 
$handler = new Handler();

// Process the request
$handler->process();

// Handler Functions

// process api/test.php on a PUT request
function PUT(Handler $handler)
{
    $pdo = $handler->db->PDO();

    // gets the new list name here
    $data = $handler->request->input;

    //gets the id for the list
    $idx = $handler->request->get["id"];
    
    //echo("text here is " . gettype($data) . " and idx is " . gettype($idx));

    $query = "CALL update_list_name(?,?)";

    $statement = $pdo->prepare($query);

    $statement->execute([$data, $idx]);

    $results = $statement->fetchAll();

    $handler->response->json($results);
    
}
