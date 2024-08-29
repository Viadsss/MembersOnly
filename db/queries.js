const pool = require("./pool");

async function getMessagesWithAuthors() {
  const { rows } = await pool.query(
    `
    SELECT
      users.username, 
      messages.*
    FROM messages
    JOIN users ON messages.author_id = users.id
    ORDER BY messages.created_at DESC;
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

async function getMessageById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM messages WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

async function getTotalMessages() {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*) as total FROM messages
    `
  );

  return parseInt(rows[0].total);
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

async function insertMessage(author_id, title, content) {
  const { rows } = await pool.query(
    `
    INSERT INTO messages (author_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [author_id, title, content]
  );

  return rows[0];
}

async function updateMemberStatus(id) {
  await pool.query(
    `
    UPDATE users
    SET is_member = TRUE
    WHERE id = $1
    `,
    [id]
  );
}

async function updateAdminStatus(id) {
  await pool.query(
    `
    UPDATE users
    SET is_admin = TRUE
    WHERE id = $1
    `,
    [id]
  );
}

async function deleteMessage(id) {
  await pool.query(
    `
    DELETE FROM messages
    WHERE id = $1 
    `,
    [id]
  );
}

module.exports = {
  getMessagesWithAuthors,
  getUserByUsername,
  getUserById,
  getMessageById,
  getTotalMessages,
  doesUsernameExist,
  insertUser,
  insertMessage,
  updateMemberStatus,
  updateAdminStatus,
  deleteMessage,
};
