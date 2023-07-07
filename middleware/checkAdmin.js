module.exports = (req, res, next) => {
    console.log(req.roleName);
  if (req.roleName !== 'admin') {
    return res.json({status:0, message:"You are not an administrator"}) 
   }
  next();
};