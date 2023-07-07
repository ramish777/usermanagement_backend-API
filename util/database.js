const { createPool } = require('mysql2');

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "usermanagemnt"
});

// Get a connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }

  // Connection successful, release the connection
  connection.release();
  console.log('Connected to the database');
});

module.exports = pool.promise();