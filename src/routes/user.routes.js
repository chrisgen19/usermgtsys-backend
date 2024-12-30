const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authMiddleware, userController.getAllUsers);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);

router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

router.post('/', authMiddleware, userController.createUser); 

module.exports = router;
