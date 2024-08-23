<?php
require './config/database.php';

echo ini_get('session.save_path');

// In your PHP file where session is 

// After setting session variables
echo "Session ID: " . session_id() . "<br>";
echo "User ID: " . $_SESSION['id'] . "<br>";
echo "Username: " . $_SESSION['username'] . "<br>";
echo "Email: " . $_SESSION['email'] . "<br>";



//ini_set('session.cookie_secure', 1); // Ensure cookies are only sent over HTTPS
