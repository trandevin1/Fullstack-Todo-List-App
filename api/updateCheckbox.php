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
    // You could include an id in the URL as a get variable
    // But more likely it's already in the input data being sent via request->input. 
    // Connect to the DB and execute the necessary query to update the record (row). 

    $pdo = $handler->db->PDO();

    // gets the bool value of the checkbox
    $data = $handler->request->input;

    //gets the id for the list item
    $idx = $handler->request->get["id"];
    
    echo("bool value is: " . $data . " and idx is " . $idx);

    $query = "CALL update_marked_complete(?,?)";

    $statement = $pdo->prepare($query);

    $statement->execute([$data, $idx]);

    $results = $statement->fetchAll();

    $handler->response->json($results);
    
}
