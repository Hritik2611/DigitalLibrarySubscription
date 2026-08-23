// this file is use to generate JWT (JSON web token )

const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }

    if (process.env.NODE_ENV !== 'production') {
        return 'dev-jwt-secret-change-me';
    }

    throw new Error('JWT_SECRET is not configured');
};

const generateToken = (id) => {
    return jwt.sign({ id }, getJwtSecret(), {
        expiresIn: '30d',
    });
};
  
 module.exports = generateToken;
