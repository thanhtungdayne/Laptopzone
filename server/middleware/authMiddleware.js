const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  console.log('Trước verifyToken - req.params:', req.params);
  console.log('Trước verifyToken - req.headers.authorization:', req.headers.authorization);

  try {
    const authHeader = req.headers.authorization; 
    if (!authHeader) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Sau verifyToken - req.params:', req.params);
    console.log('req.user:', req.user);
    next();
  } catch (err) {
    console.log('Lỗi verify token:', err.message);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = verifyToken;