<?php
require '../config/database.php';

class Users{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    public function findUserByUsernameOrEmail($username, $email){
        $this->db->query('SELECT * FROM registry WHERE username = :username OR email = :email');
        $this->db->bind(':username', $username);
        $this->db->bind(':email', $email);

        $row = $this->db->single();

        // check row
        if($this->db->rowCount() > 0){
            return $row;
        }else{
            return false;
        }
    }

    public function register($data){
        $this->db->query('INSERT INTO registry(username, email, password) VALUES (:username, :email, :password)');
        $this->db->bind(':username', $data['username']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':password', $data['password']);

        return $this->db->execute();
    }

    public function login($username_email, $password) {
        $row = $this->findUserByUsernameOrEmail($username_email, $username_email);

        if(!$row || !isset($row['password'])) {
            return false;
        }

        $hashedPassword = $row['password'];

        if(password_verify($password, $hashedPassword)) {
            return $row;
        } else {
            return false;
        }
    }
}