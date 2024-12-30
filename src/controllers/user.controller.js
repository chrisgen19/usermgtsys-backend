const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {
  async register(req, res) {
    try {
      const user = await User.create(req.body);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.updateById(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.deleteById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createUser(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'Username, email, and password are required' 
        });
      }

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email already registered' 
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password
      });

      // Return user without password
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;