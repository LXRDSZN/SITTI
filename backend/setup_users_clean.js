"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt_1 = __importDefault(require("bcrypt"));
var prisma = new client_1.PrismaClient();
function setupUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var deletedUsuarios, deletedRoles, rolUsuario, rolTecnico, rolAdmin, areaVentas, areaTaller, areaRefacciones, areaSistemas, areaAdmin, hashedPassword, usuariosArea, _i, usuariosArea_1, usuarioData, user, tecnico, admin, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 18, 19, 21]);
                    console.log('🗑️  LIMPIANDO USUARIOS Y ROLES...\n');
                    return [4 /*yield*/, prisma.usuario.deleteMany()];
                case 1:
                    deletedUsuarios = _a.sent();
                    console.log("\u2705 ".concat(deletedUsuarios.count, " usuarios eliminados\n"));
                    return [4 /*yield*/, prisma.rol.deleteMany()];
                case 2:
                    deletedRoles = _a.sent();
                    console.log("\u2705 ".concat(deletedRoles.count, " roles eliminados\n"));
                    console.log('📋 CREANDO NUEVOS ROLES...\n');
                    return [4 /*yield*/, prisma.rol.create({
                            data: { nombre: 'usuario' },
                        })];
                case 3:
                    rolUsuario = _a.sent();
                    console.log("\u2705 Rol creado: usuario");
                    return [4 /*yield*/, prisma.rol.create({
                            data: { nombre: 'técnico' },
                        })];
                case 4:
                    rolTecnico = _a.sent();
                    console.log("\u2705 Rol creado: t\u00E9cnico");
                    return [4 /*yield*/, prisma.rol.create({
                            data: { nombre: 'administrador' },
                        })];
                case 5:
                    rolAdmin = _a.sent();
                    console.log("\u2705 Rol creado: administrador\n");
                    console.log('🏢 OBTENER ÁREAS...\n');
                    return [4 /*yield*/, prisma.area.findUnique({ where: { nombre: 'Ventas' } })];
                case 6:
                    areaVentas = _a.sent();
                    return [4 /*yield*/, prisma.area.findUnique({ where: { nombre: 'Taller' } })];
                case 7:
                    areaTaller = _a.sent();
                    return [4 /*yield*/, prisma.area.findUnique({ where: { nombre: 'Refacciones' } })];
                case 8:
                    areaRefacciones = _a.sent();
                    return [4 /*yield*/, prisma.area.findUnique({ where: { nombre: 'Sistemas' } })];
                case 9:
                    areaSistemas = _a.sent();
                    return [4 /*yield*/, prisma.area.findUnique({ where: { nombre: 'Administración' } })];
                case 10:
                    areaAdmin = _a.sent();
                    return [4 /*yield*/, bcrypt_1.default.hash('password123', 10)];
                case 11:
                    hashedPassword = _a.sent();
                    console.log('👥 CREANDO USUARIOS...\n');
                    // 1️⃣ USUARIOS (1 por área)
                    console.log('1️⃣  USUARIOS (1 por cada área):\n');
                    usuariosArea = [
                        {
                            nombre: 'Juan Pérez',
                            correo: 'usuario.ventas@sitti.com',
                            password_hash: hashedPassword,
                            id_rol: rolUsuario.id_rol,
                            id_area: (areaVentas === null || areaVentas === void 0 ? void 0 : areaVentas.id_area) || 1,
                        },
                        {
                            nombre: 'Roberto García',
                            correo: 'usuario.taller@sitti.com',
                            password_hash: hashedPassword,
                            id_rol: rolUsuario.id_rol,
                            id_area: (areaTaller === null || areaTaller === void 0 ? void 0 : areaTaller.id_area) || 3,
                        },
                        {
                            nombre: 'María López',
                            correo: 'usuario.refacciones@sitti.com',
                            password_hash: hashedPassword,
                            id_rol: rolUsuario.id_rol,
                            id_area: (areaRefacciones === null || areaRefacciones === void 0 ? void 0 : areaRefacciones.id_area) || 2,
                        },
                        {
                            nombre: 'Luis Rodríguez',
                            correo: 'usuario.sistemas@sitti.com',
                            password_hash: hashedPassword,
                            id_rol: rolUsuario.id_rol,
                            id_area: (areaSistemas === null || areaSistemas === void 0 ? void 0 : areaSistemas.id_area) || 13,
                        },
                    ];
                    _i = 0, usuariosArea_1 = usuariosArea;
                    _a.label = 12;
                case 12:
                    if (!(_i < usuariosArea_1.length)) return [3 /*break*/, 15];
                    usuarioData = usuariosArea_1[_i];
                    return [4 /*yield*/, prisma.usuario.create({ data: usuarioData })];
                case 13:
                    user = _a.sent();
                    console.log("   \u2705 ".concat(user.nombre, " (").concat(user.correo, ") - \u00C1rea: ").concat(usuarioData.id_area));
                    _a.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 12];
                case 15:
                    // 2️⃣ TÉCNICO (1 que cubre TODAS las áreas)
                    console.log('\n2️⃣  TÉCNICO (Resuelve tickets de TODAS las áreas):\n');
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                nombre: 'Carlos López (Técnico)',
                                correo: 'tecnico@sitti.com',
                                password_hash: hashedPassword,
                                id_rol: rolTecnico.id_rol,
                                id_area: (areaSistemas === null || areaSistemas === void 0 ? void 0 : areaSistemas.id_area) || 13,
                            },
                        })];
                case 16:
                    tecnico = _a.sent();
                    console.log("   \u2705 ".concat(tecnico.nombre, " (").concat(tecnico.correo, ")\n"));
                    // 3️⃣ ADMINISTRADOR (1 único)
                    console.log('3️⃣  ADMINISTRADOR:\n');
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                nombre: 'Gerente Sistemas (Administrador)',
                                correo: 'admin@sitti.com',
                                password_hash: hashedPassword,
                                id_rol: rolAdmin.id_rol,
                                id_area: (areaAdmin === null || areaAdmin === void 0 ? void 0 : areaAdmin.id_area) || 4,
                            },
                        })];
                case 17:
                    admin = _a.sent();
                    console.log("   \u2705 ".concat(admin.nombre, " (").concat(admin.correo, ")\n"));
                    console.log('✨ ESTRUCTURA CREADA CORRECTAMENTE\n');
                    console.log('╔════════════════════════════════════════════════════════╗');
                    console.log('║          CREDENCIALES DE ACCESO                       ║');
                    console.log('╚════════════════════════════════════════════════════════╝');
                    console.log('\n👤 USUARIOS (1 por área):');
                    console.log('   usuario.ventas@sitti.com / password123 (Ventas)');
                    console.log('   usuario.taller@sitti.com / password123 (Taller)');
                    console.log('   usuario.refacciones@sitti.com / password123 (Refacciones)');
                    console.log('   usuario.sistemas@sitti.com / password123 (Sistemas)');
                    console.log('\n👨‍💼 TÉCNICO (resuelve todas las áreas):');
                    console.log('   tecnico@sitti.com / password123');
                    console.log('\n👑 ADMINISTRADOR:');
                    console.log('   admin@sitti.com / password123');
                    console.log('\n═════════════════════════════════════════════════════════\n');
                    return [3 /*break*/, 21];
                case 18:
                    error_1 = _a.sent();
                    console.error('❌ Error:', error_1);
                    return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, prisma.$disconnect()];
                case 20:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    });
}
setupUsers();
