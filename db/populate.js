const { Client } = require("pg");

const dbUrl = process.argv[2];

if (!dbUrl) {
  console.error("Error: No database URL provided.");
  process.exit(1);
}

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    membership_status BOOLEAN NOT NULL,
    admin_status BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, username, password, membership_status, admin_status)
VALUES 
    ('John', 'Doe', 'johndoe', 'password123', TRUE, FALSE),
    ('Jane', 'Smith', 'janesmith', 'password456', TRUE, TRUE),
    ('Alice', 'Johnson', 'alicej', 'password789', FALSE, FALSE);

INSERT INTO messages (author_id, title, content)
VALUES 
    (1, 'Welcome to the Forum', 'Hello everyone, welcome to our new forum!'),
    (2, 'Admin Announcement', 'Please make sure to follow the forum rules.'),
    (1, 'General Discussion', 'Feel free to discuss anything here.'),
    (3, 'Inactive User Post', 'This post is from an inactive user.');
`;

async function main() {
  console.log("Seeding database...");
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}

main();
