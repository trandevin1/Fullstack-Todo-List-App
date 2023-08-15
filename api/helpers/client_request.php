<?php

class ClientRequest
{
    public string $uri;
    public $method;
    public $files;
    public $post;
    public $get;
    public $input;
    private $rawInput;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->files = $_FILES;
        $this->post = $_POST;
        $this->get = $_GET;
        $this->uri = $_SERVER['REQUEST_URI'];
        $this->rawInput = file_get_contents("php://input");
        $this->input = json_decode($this->rawInput, true) ?? [];
    }
}