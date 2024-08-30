# HideSpot

HideSpot is an exclusive clubhouse app where members can write anonymous posts. Inside the clubhouse, members can see the authors of posts, but outside, they can only view the content and wonder who wrote it. This project is designed to practice authentication, session management, and database skills.

This project was created as part of [The Odin Project's Node.js course](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs). The specific assignment is titled "[Project: Members Only](https://www.theodinproject.com/lessons/node-path-nodejs-members-only)," which focuses on building an exclusive clubhouse application with authentication and database management

You can view the live version of the application [here](https://hidespot.up.railway.app/)

## Table of Contents

- [Features](#features)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Routes](#routes)
- [Technologies Used](#technologies-used)

## Features

- **User Authentication:** Sign-up, login, and secure password management.
- **Session Management:** Persistent user sessions to maintain login states across requests.
- **Membership Status:** Users sign up but are not immediately granted membership status. Members can join the club by entering a secret passcode.
- **Message Creation:** Authenticated users can create new messages with a title, timestamp, and content.
- **Anonymous Posting:** Non-members can see the message content but not the author.
- **Admin Privileges:** Admin users can delete messages.
- **Database Integration:** PostgreSQL is used to store user information, messages, and membership status.

## Environment Variables

Before running the HideSpot application, set up your environment by creating a `.env` file in the root directory with the following variables:

- **`NODE_ENV`**: Set to `development` or `production`.
- **`DB_URL_PROD`**: Production PostgreSQL database URL.
- **`DB_URL_DEV`**: Development PostgreSQL database URL.
- **`PORT`**: Port number for the app (e.g., `3000`).
- **`SESSION_SECRET`**: Secret key for signing session cookies.

### Example `.env` File

```plaintext
NODE_ENV=development
DB_URL_PROD=postgres://user:password@localhost:5432/db_name
DB_URL_DEV=postgres://user:password@localhost:5432/db_name
PORT=3000
SESSION_SECRET=your-secret-key
```

Make sure to replace the placeholder values with your actual configuration details.

## Installation

1. Clone the repository:
   ```bash
   https://github.com/Viadsss/MembersOnly.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MembersOnly
   ```
3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up the PostgreSQL database:

   Create the database: Ensure you have PostgreSQL installed. Create a new database for your project using the database names specified in your .env file. You can use a command like:

   ```bash
   createdb db_name
   ```

Replace `db_name` with the name you plan to use.

5. Populate the database:

   ```bash
   npm run populate <db-url>
   ```

   Replace <db-url> with either `DB_URL_DEV` or `DB_URL_PROD` based on your environment. Ensure `NODE_ENV` is correctly set in your `.env` file.

6. Start the application:
   ```bash
   npm start
   ```

## Usage

- **Sign Up:** Users can sign up by providing their first name, last name, username, and password. After signing up, they can attempt to join the club using a secret passcode.
- **Join the Club:** Users who know the passcode can enter it to gain membership status and see additional message details.
- **Create and View Messages:** Authorized users can create new messages, and all users can view the messages, but only members can see the authors.
- **Admin Features:** Admin users have additional privileges, such as deleting messages.

## Database Schema

### Users Table

- **id**: Primary Key, Integer
- **first_name**: String
- **last_name**: String
- **username**: Unique, String
- **password**: Hashed, String
- **is_member**: Boolean
- **is_admin**: Boolean
- **created_at**: Timestamp

### Messages Table

- **id**: Primary Key, Integer
- **author_id**: Foreign Key, Integer (References `users.id`)
- **title**: String
- **content**: Text
- **created_at**: Timestamp

## Routes

### Index Routes

- `GET /` - Display home page.
- `GET /sign-up` - Display the sign-up form.
- `GET /log-in` - Display the login form.
- `GET /log-out` - Log out the user.
- `GET /join-club` - Display the "Join the Club" form.
- `GET /admin` - Display admin dashboard.
- `POST /sign-up` - Handle user registration.
- `POST /log-in` - Handle user login.
- `POST /join-club` - Handle membership status update.
- `POST /admin` - Handle admin status update.

### Message Routes

- `GET /messages/create` - Display the form to create a new message.
- `POST /messages/create` - Handle message creation.
- `POST /messages/:id/delete` - Handle message deletion (admin only).

## Technologies Used

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Passport.js**
- **bcrypt**
- **EJS**
- **express-validator**
- **express-session**
- **dotenv**
