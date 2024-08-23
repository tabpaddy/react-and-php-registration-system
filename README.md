
# Full React & PHP PDO CRUD Application

This project is a full-featured web application built with React for the frontend and PHP with PDO for the backend. It implements a user registration and login system along with complete CRUD functionalities for managing user data. The backend is structured using Object-Oriented Programming (OOP) principles, ensuring clean, maintainable, and scalable code.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application is designed to demonstrate a full-stack approach to building a CRUD system with a focus on user management. It includes:

- User registration and login.
- Protected routes and session management.
- CRUD operations (Create, Read, Update, Delete) for user profiles.
- Client-side form validation and server-side validation.
- Integration of PDO for secure and efficient database interactions.

## Features

- **User Authentication**: Register, login, and logout functionality.
- **CRUD Operations**: Create, read, update, and delete user profiles.
- **Responsive Design**: The frontend is built with responsive design principles, making it suitable for all devices.
- **Error Handling**: Robust error handling on both client and server sides.
- **Secure**: Uses prepared statements with PDO to prevent SQL injection and manage user sessions securely.

## Technologies Used

- **Frontend**: React, CSS Modules, React Router
- **Backend**: PHP, PDO (PHP Data Objects)
- **Database**: MySQL (or compatible database)
- **API Communication**: Fetch API with JSON format

## Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PHP](https://www.php.net/)
- A web server like Apache or Nginx
- MySQL or any other compatible database

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tabpaddy/react-and-php-registration-system.git
   cd full-react-php-crud
   ```

2. **Set Up the Backend**

   - Navigate to the `backend` directory.
   - Configure your database connection in the `config.php` file.
   - Import the provided SQL file (`database.sql`) into your MySQL database.

3. **Install Frontend Dependencies**

   Navigate to the `frontend` directory and run:

   ```bash
   npm install
   ```

   or, if you're using Yarn:

   ```bash
   yarn install
   ```

### Configuration

#### **Backend Configuration**

1. **Database Configuration**: Update the database settings in `config.php` in the `backend` directory:
   ```php
   // config.php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASS', 'your_database_password');
   ```

2. **Error Display**: Ensure error reporting is enabled during development in `php.ini` or at the start of your PHP scripts:
   ```php
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
   ```

#### **Frontend Configuration**

1. **API Base URL**: Update the API base URL in your React app if needed. This can usually be done in a configuration file or environment file, such as `.env`:
   ```env
   REACT_APP_API_URL=http://localhost/backend
   ```

### Running the Application

#### Start the Backend Server

Ensure your PHP server is running. If using Apache, ensure it's configured to handle the PHP files in the `backend` directory.

#### Start the Frontend Development Server

Navigate to the `frontend` directory and run the following command:

```bash
npm start
```

or, for Yarn users:

```bash
yarn start
```

This will start the React development server and open the application in your default browser.

### API Endpoints

Here is a list of the API endpoints available in the backend:

#### **User Registration**

- **Endpoint**: `/register.php`
- **Method**: `POST`
- **Request Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- **Response**: JSON object indicating success or failure

#### **User Login**

- **Endpoint**: `/login.php`
- **Method**: `POST`
- **Request Body**: `{ "email": "john@example.com", "password": "password123" }`
- **Response**: JSON object indicating success or failure with session data

#### **Fetch User Data**

- **Endpoint**: `/getUser.php`
- **Method**: `GET`
- **Response**: JSON object with user data

#### **Update User Data**

- **Endpoint**: `/updateUser.php`
- **Method**: `POST`
- **Request Body**: `{ "user_id": "1", "name": "John Doe", "email": "john@example.com" }`
- **Response**: JSON object indicating success or failure

#### **Delete User**

- **Endpoint**: `/deleteUser.php`
- **Method**: `DELETE`
- **Request Body**: `{ "user_id": "1" }`
- **Response**: JSON object indicating success or failure

### Database Schema

Here’s the basic schema for the `users` table:

```sql
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

### Troubleshooting

- **Database Connection Issues**: Double-check your `database.php` for correct database credentials.
- **CORS Issues**: If your frontend and backend are on different domains, ensure the backend is set up to handle CORS properly.
- **Session Problems**: Ensure your server is correctly handling PHP sessions and that session storage is writable.
- **Frontend Not Updating**: Make sure to clear your browser cache or use `Ctrl + F5` to force refresh.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
