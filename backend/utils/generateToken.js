 // this file is use to generate JWT (JSON web token )

 const jwt = require('jsonwebtoken');

const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
       expiresIn: '30d',
   });
}
  
 module.exports = generateToken;
