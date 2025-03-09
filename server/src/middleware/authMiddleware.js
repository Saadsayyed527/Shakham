import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token.substring(7), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send('Invalid Token');
    }
};

export default authenticate;
