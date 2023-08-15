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


function POST(Handler $handler)
{
    $pdo = $handler->db->PDO();

    // gets the data sent
    $data = $handler->request->input;

    //gets the id for the list
    $idx = $handler->request->get["id"];
    

    $query = "CALL create_list_item(?,?)";

    $statement = $pdo->prepare($query);

    $statement->execute([$data, $idx]);


    $results = $statement->fetchAll();

    $handler->response->json($results);

}