import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { RegisterInput, LoginInput } from '../validators/auth.schema.js';

export const registerUser = async (input: RegisterInput) => {
  const { nombre, correo, password, id_rol, id_area } = input;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (usuarioExistente) {
    throw new Error('El correo ya está registrado');
  }

  const password_hash = await hashPassword(password);

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      password_hash,
      id_rol,
      id_area,
      activo: true,
    },
    include: {
      rol: true,
      area: true,
    },
  });

  const token = generateToken(usuario.id_usuario, usuario.correo);

  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
      id_area: usuario.id_area,
      area: usuario.area.nombre,
    },
  };
};

export const loginUser = async (input: LoginInput) => {
  const { correo, password } = input;

  const usuario = await prisma.usuario.findUnique({
    where: { correo },
    include: {
      rol: true,
      area: true,
    },
  });

  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  if (!usuario.activo) {
    throw new Error('Usuario inactivo');
  }

  const passwordValida = await comparePassword(password, usuario.password_hash);
  if (!passwordValida) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken(usuario.id_usuario, usuario.correo);

  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
      id_area: usuario.id_area,
      area: usuario.area.nombre,
    },
  };
};

export const getUserById = async (id_usuario: number) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario },
    include: {
      rol: true,
      area: true,
    },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol.nombre,
    id_area: usuario.id_area,
    area: usuario.area.nombre,
  };
};
