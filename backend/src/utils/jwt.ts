import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

const signingSecret = JWT_SECRET || 'tu-super-secreto-jwt-change-in-production';
const JWT_EXPIRY = '7d';

export const generateToken = (id_usuario: number, correo: string) => {
  return jwt.sign({ id_usuario, correo }, signingSecret, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, signingSecret) as { id_usuario: number; correo: string };
  } catch (error) {
    return null;
  }
};
