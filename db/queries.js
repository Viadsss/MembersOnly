const pool = require("./pool");

async function getMessagesWithAuthors() {
  const { rows } = await pool.query(
    `
    SELECT 
        messages.*,
        users.id AS author_id,
        users.first_name,
        users.last_name,
        users.username
    FROM 
        messages
    INNER JOIN 
        users 
    ON 
        messages.author_id = users.id;
    `
  );

  return rows;
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(
    `
    SELECT * FROM users WHERE username = $1
    `,
    [username]
  );

  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

async function insertUser(first_name, last_name, username, password) {
  const { rows } = await pool.query(
    `
    INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4) 
    RETURNING * 
  `,
    [first_name, last_name, username, password]
  );

  return rows[0];
}

async function doesUsernameExist(username) {
  const { rows } = await pool.query(
    `
    SELECT * FROM users WHERE username = $1
    `,
    [username]
  );

  return rows.length > 0;
}

module.exports = {
  getMessagesWithAuthors,
  getUserByUsername,
  getUserById,
  insertUser,
  doesUsernameExist,
};
