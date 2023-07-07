const express = require('express');

const loginController = require('../controller/login');
const UserController = require('../controller/user');
const isAuth = require('../middleware/is-auth');
const checkAdminRole = require('../middleware/checkAdmin');


const router = express.Router();

const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: 'uploads/', // Specify the destination directory to store uploaded files
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Set up multer upload configuration
const upload = multer({ storage: storage });

// const checkAdminRole = (req, res, next) => {
//   console.log(req.roleName);
//   if (req.roleName !== 'admin') {
//     // const error = new Error('Not authorized as admin.');
//     // error.statusCode = 403;

//     // throw error;
//     return res.json({status:0, message:"You are not an administrator"}) 
//    }
//   next();
// };
  
// Routes
router.post('/login', UserController.homepage);
router.get('/dashboard/:user_name', isAuth, UserController.renderUserDetails);
router.get('/dashboard/:username/createUser', isAuth,checkAdminRole, UserController.renderCreateUserPage);
router.post('/created', isAuth,checkAdminRole, UserController.creation);
router.post('/dashboard/:username/editUser', isAuth,checkAdminRole, UserController.editUser);
router.get('/dashboard/:username/editpage', isAuth,checkAdminRole, UserController.renderEditPage);
router.post('/updateChanges',isAuth,checkAdminRole,  UserController.updateUsers);
router.post('/dashboard/:username/deleteUser', isAuth,checkAdminRole, UserController.deleteUser);
router.post('/dashboard/:username/uploadUser', isAuth,checkAdminRole,upload.single('userFile') ,UserController.uploadUsers); 
router.get('/logout', loginController.logout);
router.get('/', loginController.getloginpage);

module.exports = router;
