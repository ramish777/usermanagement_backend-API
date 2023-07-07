const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log(authHeader);
  if (!authHeader) {
    // const error = new Error('Not authenticated.');
    // error.statusCode = 401;
    // throw error;
    return res.json({ message:"please provide a valid auth header or webToken"})
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    //console.log('stuck at try ')
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    //console.log('stuck at catch ')
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  //console.log('stuck at userid ')
  //req.userId = decodedToken.userId;
  req.roleName = decodedToken.role_name;
  next();
};


