const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { validateSignup, validateLogin } = require('../utils/validation');
const prisma = new PrismaClient();

const signup = async (req, res) => {
  try {
    const { error } = validateSignup(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, role, name, username } = req.body;

    const validRole = role.toUpperCase();
    if (!['ADMIN', 'EMPLOYEE'].includes(validRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role:validRole, name, username },
    });

    const token = generateToken(user);

    res.status(201).json({ user, token, message: "User created successfully" });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'User creation failed' });
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