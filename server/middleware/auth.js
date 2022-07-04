import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ message: 'You are not authenticated.' });

    jwt.verify(token, process.env.JWT_SALT, (error, decodedData) => {
        if (error) return res.status(403).json({ message: 'Token is invalid!' });

        req.user = decodedData;

        next();
    });
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) return next();

        return res.status(403).json({ message: 'You are not authorized.' });
    });
}