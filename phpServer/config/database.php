<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('session.cookie_secure', 0);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');


session_start();

class Database{
    private $host = 'Localhost';
    private $user = 'root';
    private $pass = '';
    private $dbname = 'reactregistrationsystem';

    private $dbh;
    private $stmt;
    private $error;

    public function __construct(){
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname;
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        );

        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            echo $this->error;
        }
    }

    public function query($sql){
        $this->stmt = $this->dbh->prepare($sql);
    }

    public function bind($param, $value, $type = null){
        if(is_null($type)){
            switch (true) {
                case is_int($value):
                    # code...
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value);
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value);
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    # code...
                    $type = PDO::PARAM_STR;
                
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    public function execute(){
        return $this->stmt->execute();
    }

    public function resultSet(){
        $this->execute();
        return $this->stmt->fetchAll();
    }

    public  function single(){
        $this->execute();
        return $this->stmt->fetch();
    }

    public function rowCount(){
        return $this->stmt->rowCount();
    }


}

// After setting session variables
// echo "Session ID: " . session_id() . "<br>";
// echo "User ID: " . $_SESSION['id'] . "<br>";
// echo "Username: " . $_SESSION['username'] . "<br>";
// echo "Email: " . $_SESSION['email'] . "<br>";
