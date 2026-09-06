import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-super-secreto-jwt-change-in-production';
const JWT_EXPIRY = '7d';

export const generateToken = (id_usuario: number, correo: string) => {
  return jwt.sign({ id_usuario, correo }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id_usuario: number; correo: string };
  } catch (error) {
    return null;
  }
};
