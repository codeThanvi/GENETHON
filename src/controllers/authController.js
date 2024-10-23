const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { validateSignup, validateLogin } = require('../utils/validation');
const prisma = new PrismaClient();
const rateLimiter = require('rate-limiter-flexible');

const signup = async (req, res) => {
  try {
    const { error } = validateSignup(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, role ,name,} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User creation failed' });
  }
};

const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { signup, login };