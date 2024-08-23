<?php
require '../config/database.php';

class Post {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function getPostsById($uid) {
        $this->db->query('SELECT p.*, r.id as author_id 
                          FROM post p 
                          JOIN registry r ON p.author_id = r.id 
                          WHERE p.author_id = :uid');
        $this->db->bind(':uid', $uid);
        $result = $this->db->resultSet();

        return ($this->db->rowCount() > 0) ? $result : false;
    }

    public function getSinglePostById($postId) {
        $this->db->query('SELECT p.*, r.id as author_id
                          FROM post p 
                          JOIN registry r ON p.author_id = r.id
                          WHERE p.id = :postId');
        $this->db->bind(':postId', $postId);
        $result = $this->db->single();
    
        return ($this->db->rowCount() > 0) ? $result : false;
    }

    public function userPostById($id) {
        $this->db->query('SELECT * FROM post WHERE id = :id');
        $this->db->bind(':id', $id);
        $result = $this->db->single();

        return ($this->db->rowCount() == 1) ? $result : false;
    }

    public function addPost($data) {
        $this->db->query('INSERT INTO post (name, email, author_id) VALUES (:name, :email, :author_id)');
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':author_id', $data['user_id']);
        
        return $this->db->execute();
    }

    public function deletePost($id) {
        $this->db->query('DELETE FROM post WHERE id = :id');
        $this->db->bind(':id', $id);

        return $this->db->execute();
    }

    public function updatePost($data) {
        $this->db->query('UPDATE post SET name = :name, email = :email WHERE id = :id');
        $this->db->bind(':id', $data['post_id']);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':email', $data['email']);

        return $this->db->execute();
    }
}
