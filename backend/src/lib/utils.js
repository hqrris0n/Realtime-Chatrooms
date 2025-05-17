// contains utility functions for the backend
import jwt from 'jsonwebtoken';


export const generateToken = (userId, res) => {
  // userId = payload to differentiate between users; JWT Secret for security, and an options object with an expiration time
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '7d', // token expiration time
  });

  // returning the token in a cookie and securing it with options object
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // only accessible by the web server; not by client-side JavaScript (XSS attack)
    sameSite: 'strict', // cookie is only sent to the same site (CSRF attack)
    secure: process.env.NODE_ENV !== 'development', // cookie is only sent over HTTPS in production
  })

  return token;
}