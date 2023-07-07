const db = require('../util/database');

module.exports = class Product {
  constructor(id, username, password, name, occupation,age) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.occupation = occupation;
    this.age = age;
  }

  static save(username, password, name, occupation, age) {
      return db.execute(
        'INSERT INTO users1 ( username, password, name, occupation, age, role_id) VALUES (?, ?, ?, ?, ?, ?)',
        [ username, password, name, occupation, age, 2]
      );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM users1');
  }

  static findByUsername(username,password) {
    return new Promise((resolve, reject) => {
      db.query('SELECT u.id,u.username,u.password,u.name,u.occupation,u.age,r.role_name FROM users1 as u INNER JOIN roles as r ON u.role_id = r.id WHERE username = ? and password= ? ;', [username, password])
        .then(([rows]) => {
          resolve(rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findByUsernameOnly(username) {
    return new Promise((resolve, reject) => {
      db.query('SELECT u.id,u.username,u.password,u.name,u.occupation,u.age,r.role_name FROM users1 as u INNER JOIN roles as r ON u.role_id = r.id WHERE username = ?;', [username])
        .then(([rows]) => {
          resolve(rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllUsers() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users1 WHERE role_id = 2')
        .then(([rows]) => {
          resolve(rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllUsersPagination(offset) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users1 WHERE role_id = 2 LIMIT 5 OFFSET ' + offset)
        .then(([rows]) => {
          resolve(rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static updateUser(username, password, occupation, age, name) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users1 SET username = ?, password = ?, age = ?, occupation = ?, name = ? WHERE username = ?',
        [username, password, age, occupation, name, username]
      )
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteUser(username) {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM users1 WHERE username = ?', [username]
      )
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

};
