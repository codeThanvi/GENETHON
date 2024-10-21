const jwt=require('jsonwebtoken');
const SECRET_KEY=process.env.JWT_SECRET

const generateToken=(user)=>{
    return jwt.sign({id:user.id,role:user.role},SECRET_KEY,{expiresIn:'1h'});
}


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch {
      res.status(403).json({ error: 'Invalid token' });
    }
  };

  const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };

  module.exports = { generateToken, verifyToken, checkRole };