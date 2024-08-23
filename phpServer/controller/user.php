<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include headers to handle CORS and JSON
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require '../modal/users.php';

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new Users();
    }

    public function handleRequest() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Get the raw POST data
            $json = file_get_contents("php://input");
            // Decode the JSON data
            $data = json_decode($json, true);

            // Determine whether the request is for registration or login
            if ($data['type'] === 'register') {
                $this->register($data);
            } elseif ($data['type'] === 'login') {
                $this->login($data);
            } else {
                $this->sendResponse([
                    'status' => 'error',
                    'message' => 'Invalid action type.'
                ]);
            }
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Invalid request method.'
            ]);
        }
    }

    private function register($data) {
        // Validate the data
        if ($this->validate($data, 'register')) {
            if ($this->userModel->findUserByUsernameOrEmail($data['username'], $data['email'])) {
                $this->sendResponse([
                    'status' => 'error',
                    'message' => 'User already exists.'
                ]);
            } else {
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
                if ($this->userModel->register($data)) {
                    $this->sendResponse([
                        'status' => 'success',
                        'message' => 'User registered successfully.',
                        'redirect' => '/login'
                    ]);
                } else {
                    $this->sendResponse([
                        'status' => 'error',
                        'message' => 'User could not be registered.'
                    ]);
                }
            }
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Please fill in all required fields and make sure passwords match.'
            ]);
        }
    }

    
    private function login($data) {
        // Validate the data
        if ($this->validate($data, 'login')) {
            $user = $this->userModel->findUserByUsernameOrEmail($data['username_email'], $data['username_email']);

            if ($user) {
                $loggedUser = $this->userModel->login($data['username_email'], $data['password']);

                if ($loggedUser){
                    $this->createUserSession($user);
                }else{
                    $this->sendResponse([
                        'status' => 'error',
                        'message' => 'Invalid Password.'
                    ]);
                }
                  
            } else {
                $this->sendResponse([
                    'status' => 'error',
                    'message' => 'Invalid Username or Email.'
                ]);
            }
        } else {
            $this->sendResponse([
                'status' => 'error',
                'message' => 'Please fill in all required fields.'
            ]);
        }
    }

    public function createUserSession($user) {
        $_SESSION['id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];

        // In your PHP file where session is set
        // Debugging step
        error_log('Session ID after login: ' . session_id());
        error_log('Session data: ' . print_r($_SESSION, true));
        $this->sendResponse([
            'status' => 'success',
            'message' => 'Login successful.',
            'redirect' => '/',
            'session' => [ 'log_id' => $_SESSION['id'], 'log_username' => $_SESSION['username'], 'log_email' => $_SESSION['email']],
        ]);
    }

    private function validate($data, $type) {
        if ($type === 'register') {
            if (empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['confirmPassword'])) {
                return false;
            }
            if ($data['password'] !== $data['confirmPassword']) {
                return false;
            }
            if(strlen($data['password']) < 8){
                return false;
            }
        } elseif ($type === 'login') {
            if (empty($data['username_email']) || empty($data['password'])) {
                return false;
            }
        }
        return true;
    }

    private function sendResponse($response) {
        echo json_encode($response);
        exit;
    }
}

// Initialize and handle the request
$controller = new UserController();
$controller->handleRequest();

        // After setting session variables
        echo "Session ID: " . session_id() . "<br>";
        echo "User ID: " . $_SESSION['id'] . "<br>";
        echo "Username: " . $_SESSION['username'] . "<br>";
        echo "Email: " . $_SESSION['email'] . "<br>";

