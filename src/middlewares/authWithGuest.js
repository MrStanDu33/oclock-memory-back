import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (!req.headers.authorization || req.headers.authorization.length === 0) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};
