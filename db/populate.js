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
    is_member BOOLEAN DEFAULT FALSE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, username, password, is_member, is_admin)
VALUES 
    ('John', 'Doe', 'johndoe', '$2a$10$aB8ScB41woadh9X.W6WxM.dCYIfNtn2ytZ89E7kvB4vPMoaTGtUju', TRUE, FALSE),
    ('Jane', 'Smith', 'janesmith', '$2a$10$Ygj4U6SiiH7gMc9Na7ZzyOxAE71PqpjHOP5w9PgaZClMxu1mZ38RC', FALSE, TRUE);

INSERT INTO messages (author_id, title, content)
VALUES 
    (1, 'Welcome to the Forum', 'Hello everyone, welcome to our new forum!'),
    (2, 'Admin Announcement', 'Please make sure to follow the forum rules.'),
    (1, 'General Discussion', 'Feel free to discuss anything here.');
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
