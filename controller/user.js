const Users = require('../model/user');
const csv = require('csv-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.homepage = (req, res, next) => {

  const username = req.body.login;
  const password = req.body.password;
  Users.findByUsername(username, password)
    .then((rows) => {
      if (rows.length > 0) {
        req.session.username = rows[0].username; // Set the session variable
        const token = jwt.sign(
          {
            email: rows[0].username,
            userId: rows[0].id,
            role_name: rows[0].role_name
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({
          token:token,
          message: 'Redirecting to dashboard',
          redirectUrl: '/dashboard/' + rows[0].username
        });
      
      } else {
        res.status(401).json({ error: 'Invalid login credentials' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
};


exports.renderUserDetails = (req, res, next) => {
  const page1 = req.query.page || 1;
  //console.log(page1);
  const { user_name } = req.params;
  Users.findByUsernameOnly(user_name)
    .then((rows) => {
      if (rows.length > 0) {
        if (rows[0]["role_name"] === "user") {
          //open userpage.ejs
          res.status(200).json({ 
            message: 'Open userpage',
            user: rows[0] 
          });
        } else {
          Users.findAllUsers()
            .then((rows1) => {
              if (rows1.length >= 0) {
                //open adminpage.ejs
                res.status(200).json({
                  message: 'Open adminpage',
                  user: rows[0],
                  data: rows1,
                  size: rows1.length,
                  page: page1
                });
              }
            })
            .catch((err) => {
              console.log("error in getUserDetails function");
              res.status(500).json({ error: 'Internal server error',
                                      message: 'redirect to login page' });
            });
        }
      } else {
        res.status(404).json({ error: 'User not found',
                               message: 'redirect to login page' }); // Redirect to login page if the login credentials are incorrect
      }
    })
    .catch((err) => {
      console.log("error in getUserDetails function");
      res.status(500).json({ error: 'Internal server error',
                             message: 'redirect to login page' }); // Redirect to login page if there's an error
    });
};

exports.renderCreateUserPage = (req, res) => {
  //console.log('createUser working');
  const previousUrl = req.header('Referer') || '/';
  res.status(200).json({ message: 'Showing create user page', previousUrl });
};

exports.renderEditUserPage = (req, res) => {
  //console.log('createUser working');
  const previousUrl = req.header('Referer') || '/';
  res.status(200).json({ message: 'Showing edit user page', previousUrl });
};

exports.creation = (req, res, next) => {
  const previousUrl = req.body.previousUrl;
  const name = req.body.name;
  const new_username = req.body.username;
  const password = req.body.password;
  const occupation = req.body.occupation;
  const age = req.body.age;

  Users.findByUsername(new_username, password)
    .then((rows) => {
      if (rows.length === 0) {
        Users.save(new_username, password, name, occupation, age);
        res.status(200).json({ message: 'User created', redirectUrl: previousUrl });
      } else {
        res.status(400).json({ error: 'User already exists' });
      }
    })
    .catch((err) => {
      console.log("found error");
      res.status(500).json({ error: 'Internal server error' });
    });
};

exports.editUser = (req, res, next) => {
  const previousUrl = req.header('Referer') || '/';
  const host_username = previousUrl.split('/').pop().split('?')[0]; // Extract username from the previous URL
  const username = req.body.username;
  const name = req.body.name;
  const age = req.body.age;
  const occupation = req.body.occupation;
  const password = req.body.password; 
  Users.findByUsernameOnly(username)
  .then((rows) => {
    if (rows.length > 0) {
      res.status(200).json({
        message: 'Redirecting to edit page',
        editUrl: `/dashboard/${host_username}/editpage?name=${name}&username=${username}&age=${age}&occupation=${occupation}&password=${password}`
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  })
  .catch((err) => {
    console.log('Error finding user:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
};

exports.renderEditPage =(req, res, next) => {
  const urlParams = new URLSearchParams(req.query);
  const username = urlParams.get('username');
  console.log('username : ' + username);
  const name = req.query.name;
  const age = req.query.age;
  const occupation = req.query.occupation;
  const password = req.query.password;
  res.status(200).json({
    message: 'Rendering edit page',
    data: {
      username,
      name,
      age,
      occupation,
      password
    }
  });
};

exports.updateUsers = (req, res, next) => {  
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const occupation = req.body.occupation;
  const age = req.body.age;
  Users.updateUser(username, password, occupation, age, name);
  console.log('User updated');
  res.status(200).json({ message: 'Redirecting to dashboard', redirectUrl: `/dashboard/${req.params.username}` });
};

exports.deleteUser= (req, res, next) => {
  const username = req.body.username;
  const previousUrl = req.header('Referer') || '/';
  // Call the method to delete the user from the database
  Users.deleteUser(username)
    .then(() => {
      res.status(200).json({ message: 'User deleted', redirectUrl: previousUrl });
    })
    .catch((err) => {
      console.log('Error deleting user:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
};

exports.uploadUsers = (req, res) => {
  const host_username = req.params.username;
  const userFile = req.file;
  console.log(host_username);
  console.log(userFile);
  console.log(userFile.path);
  // Read and parse the CSV file
  fs.createReadStream(userFile.path)
    .pipe(csv())
    .on('data', (data1) => {
      // Assuming the CSV file columns are: name, username, password, occupation, age
      const data = JSON.parse(JSON.stringify(data1));
      console.log("data is ----------->",data,"/n");
      const { name, username, password, occupation, age } = data;
      // Print the variables
      console.log('Name:', name);
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Occupation:', occupation);
      console.log('Age:', age);
      // Save the user data to the database (replace with your database logic)
      Users.save(username, password, name, occupation, age);
    })
    .on('end', () => {
      // File parsing and saving complete
      res.status(200).json({ message: 'Users uploaded successfully', redirectUrl: `/dashboard/${host_username}` });
    });
};