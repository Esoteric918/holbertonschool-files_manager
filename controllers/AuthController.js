// GET /connect should sign-in the user by generating a new authentication token

// By using the header Authorization and the technique of the Basic auth (Base64 of the <email>:<password>), find the user associate to this email and with this password (reminder: we are storing the SHA1 of the password)
// If no user has been found, return an error Unauthorized with a status code 401

// Otherwise:
    // Generate a random string (using uuidv4) as token
    // Create a key: auth_<token>
    // Use this key for storing in Redis (by using the redisClient create previously) the user ID for 24 hours
    // Return this token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" } with a status code 200


const express = require('express');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const redis = require('redis');

class AuthController {
    static getConnect(req, res) {
        const { email, password } = req.body;
        const redisClient = redis.createClient();
        redisClient.get(`auth_${email}`, (err, reply) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (reply) {
                return res.status(400).send('User already connected');
            }
            Mongo.findUserByEmail(email, (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!user) {
                    return res.status(401).send('User not found');
                }
                bcrypt.compare(password, user.password, (err, same) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (!same) {
                        return res.status(401).send('Wrong password');
                    }
                    const token = uuidv4();
                    redisClient.set(`auth_${token}`, user._id, 'EX', 24 * 60 * 60, (err, reply) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        return res.status(200).json({ token });
                    }).quit();
                }).quit();
            }).quit();
        }).quit();
    }
    static getDisconnect(req, res) {
        const { token } = req.body;
        const redisClient = redis.createClient();
        redisClient.del(`auth_${token}`, (err, reply) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).send('User disconnected');
        }).quit();
    }
}

module.exports = AuthController;
