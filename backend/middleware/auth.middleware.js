import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';
import userModel from "../models/user.model.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization').split(' ')[1];
        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            res.cookie('token', '');
            return res.status(401).send({ error: 'Please authenticate' });
        }

const decoded = jwt.verify(token, process.env.JWT_SECRET);

const user = await userModel.findOne({
    email: decoded.email
});

if (!user) {
    return res.status(401).json({
        error: "User not found",
    });
}

req.user = user;

next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
}
