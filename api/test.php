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

// process /api/test on a GET request
function GET(Handler $handler)
{
    // It is common to have multiple types of get requests depending on
    // if you want 1 or multiple records or need to filter, etc. 
    // You can write alternate functions and use this one to decide which one to execute
    if (array_key_exists("id", $handler->request->get)) {
        getListItems($handler, $handler->request->get["id"]);
    } else {
        getList($handler);
    }
    //$_GET
}

// api/test.php?id=123 would execute this function
function getListItems(Handler $handler, $id)
{
    // Use the $id and output just 1 thing

    $pdo = $handler->db->PDO();

    $query = "SELECT * FROM `list_item` WHERE list_idx=(?) ORDER BY marked_complete DESC, created ASC";

    $statement = $pdo->prepare($query);

    $statement->execute([$id]);

    $result = $statement->fetchAll();

    $handler->response->json($result);
}

// api/test.php would execute this function
function getList(Handler $handler)
{
    $pdo = $handler->db->PDO();

    // default list sort
    $query = 'SELECT * FROM `list` ORDER BY created ASC';

    $statement = $pdo->prepare($query);

    $statement->execute();

    $results = $statement->fetchAll();

    $handler->response->json($results);

}

// process api/test.php on a POST request
function POST(Handler $handler)
{

    $pdo = $handler->db->PDO();

    // This API is customized to accept and return JSON 
    // using the request->input property instead of request->post. 
    $data = $handler->request->input;

    // Do something here that creates a new record (row) using the input data. 
    $query = 'CALL create_list(?)';

    $statement = $pdo->prepare($query);

    $statement->execute([$data]);

    $result = $statement->fetchAll(); // $result should be whatever the database returned. 
    
    // Output the database result set as JSON
    $handler->response->json($result);
}

// process api/test.php on a PUT request
function PUT(Handler $handler)
{
    // You could include an id in the URL as a get variable
    // But more likely it's already in the input data being sent via request->input. 
    // Connect to the DB and execute the necessary query to update the record (row). 
}

// process api/test.php on a DELETE request
// fetching to "api/test.php?id=123" with "DELETE" as the method
// will execute this function
function DELETE(Handler $handler)
{

    // It's common to send a specific id so we know 
    // which resource to delete
    // The method here is "DELETE" but we still have access to 
    // get variables since they are part of the URL. 
    $id = $handler->request->get["id"];

    //echo($id);

    // Here you would connect to the DB and use $id as a parameter
    // To delete the resource (row) with a matching id. 

    $pdo = $handler->db->PDO();

    $query = 'DELETE FROM `list` WHERE idx=(?)';

    $statement = $pdo->prepare($query);

    $statement->execute([$id]);

    $result = $statement->fetchAll(); // $result should be whatever the database returned. 

    //add status 200 

    $handler->response->json($result);
}
