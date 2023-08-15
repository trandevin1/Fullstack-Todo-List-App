<?php
// Uncomment if you need to have detailed error reporting
error_reporting(E_ALL);

// Include the Handler class so we can use it. 
require("helpers/handler.php");

// Create a new request handler. 
$handler = new Handler();

// Process the request
$handler->process();


function DELETE(Handler $handler)
{

    $id = $handler->request->get["id"];

    $pdo = $handler->db->PDO();

    $query = 'DELETE FROM `list_item` WHERE idx=(?)';

    $statement = $pdo->prepare($query);

    $statement->execute([$id]);

    $result = $statement->fetchAll(); // $result should be whatever the database returned. 

    $handler->response->json($result);

}
