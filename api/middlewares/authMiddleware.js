/**
 * @fileoverview Middleware for verifying JWT tokens in the Authorization header.
 * @requires express
 * @requires jsonwebtoken
 */
import jwt from 'jsonwebtoken';

/**
 * Async middleware function to authenticate user based on JWT token.
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {express.NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
             return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         
        if (!decoded || !decoded.userId || !decoded.username) {
           return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
        }

        req.user = { userId: decoded.userId, username: decoded.username };
        next();
    } catch (error) {
        console.error('Error during token verification:', error);
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Unauthorized: Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
};

export default authMiddleware;
