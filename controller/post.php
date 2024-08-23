<?php
ini_set('display_errors', 1); //0 to Disable display of errors in the response
ini_set('log_errors', 1); // Enable logging of errors
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); // Report all errors except notices and warnings
ini_set('display_startup_errors', 1);


// Include headers to handle CORS and JSON
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, DELETE,');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');


require '../modal/posts.php';



class PostController {
    private $postModel;

    public function __construct() {
        $this->postModel = new Post(); 
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method == 'POST') {
            $this->handlePostRequest();
        } elseif ($method == 'GET') {
            $this->handleGetRequest();
        } elseif ($method == 'DELETE') {
            $this->handleDeleteRequest();
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Invalid request method.',
            ]);
        }
    }

    private function handlePostRequest() {
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        error_log('Session ID in post controller: ' . session_id());
        error_log('Session data in post controller: ' . print_r($_SESSION, true));

    
        if (!$data) {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Invalid JSON input.',
            ]);
            return;
        }

    
        if (!isset($_SESSION['id'])) {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Unauthorized request.',
            ]);
            return;
        }
    
        if ($data['user_id'] == $_SESSION['id']) {
            if (isset($data['post_id'])) {
                $this->updatePostData($data);
            } else {
                $this->addPostData($data);
            }
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Invalid action type.',
            ]);
        }
    }
    

    private function handleGetRequest() {
        // Check if `uid` is set in `$_GET` and `id` is set in `$_SESSION`
        if (!isset($_GET['uid']) || !isset($_SESSION['id']) || $_GET['uid'] != $_SESSION['id']) {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Unauthorized request.',
            ]);
            return;
        }
    
        $data = null;
    
        if (isset($_GET['uid'])) {
            $uid = $_GET['uid'];
            $data = $this->postModel->getPostsById($uid);
        } elseif (isset($_GET['post'])) {
            $postId = $_GET['post']; // Corrected from $_POST to $_GET
            $data = $this->postModel->getSinglePostById($postId);
        }
        
        if ($data) {
            $this->sendResponse($data);
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'No posts found for this user.',
            ]);
        }
    }
    

    private function handleDeleteRequest() {
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        if (!isset($data['post_id']) && $_SESSION['id']) {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Unauthorized request.',
            ]);
            return;
        }

        if ($this->postModel->deletePost($data['post_id'])) {
            $this->sendResponse([
                'status' => 'success',
                'message' => 'Post deleted successfully.',
            ]);
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Failed to delete the post.',
            ]);
        }
    }

    private function addPostData($data) {
        if ($this->validate($data)) {
            if ($this->postModel->addPost($data)) {
                $this->sendResponse([
                    'status' => 'success',
                    'message' => 'User added successfully.',
                    'redirect' => '/'
                ]);
            } else {
                $this->sendResponse([
                    'status' => 'error',
                    'message' => 'User could not be added.'
                ]);
            }
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Please fill in all required fields.'
            ]);
        }
    }

    private function updatePostData($data) {
        if ($this->validate($data)) {
            if ($this->postModel->updatePost($data)) {
                $this->sendResponse([
                    'status' => 'success',
                    'message' => 'Post updated successfully.',
                    'redirect' => '/'
                ]);
            } else {
                $this->sendResponse([
                    'status' => 'error',
                    'message' => 'Post could not be updated.',
                ]);
            }
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Please fill in all required fields.',
            ]);
        }
    }
    

    private function validate($data) {
        if (empty($data['name']) || empty($data['email'])) {
            return false;
        }
        return true;
    }

    private function sendResponse($response) {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    
}

$controller = new PostController();
$controller->handleRequest();
