import type { Request, Response } from 'express';
import { RegisterSchema, LoginSchema } from '../validators/auth.schema.js';
import { registerUser, loginUser, getUserById } from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
  try {
    const validacion = RegisterSchema.parse(req.body);
    const resultado = await registerUser(validacion);
    res.status(201).json(resultado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validacion = LoginSchema.parse(req.body);
    const resultado = await loginUser(validacion);
    res.json(resultado);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const usuario = await getUserById(req.usuario.id_usuario);
    res.json({ usuario });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
