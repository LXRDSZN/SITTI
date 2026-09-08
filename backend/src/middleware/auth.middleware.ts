import { Request, Response, NextFunction } from 'express';
import { verifyToken as verifyJWTToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      usuario?: { id_usuario: number; correo: string };
      userId?: number;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const payload = verifyJWTToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.usuario = payload as { id_usuario: number; correo: string };
  (req as any).userId = payload.id_usuario;
  next();
};

export const verifyToken = authMiddleware;
