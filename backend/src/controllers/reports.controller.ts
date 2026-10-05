import type { Request, Response } from 'express';
import { getReport } from '../services/reports.service.js';

const optionalPositiveInt = (value: unknown) => {
  if (value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const getReportController = async (req: Request, res: Response) => {
  try {
    const id_area = optionalPositiveInt(req.query.id_area);
    const id_estado = optionalPositiveInt(req.query.id_estado);
    const id_prioridad = optionalPositiveInt(req.query.id_prioridad);

    if (id_area === null || id_estado === null || id_prioridad === null) {
      return res.status(400).json({ success: false, error: 'Los filtros numéricos no son válidos' });
    }

    const report = await getReport({
      desde: typeof req.query.desde === 'string' ? req.query.desde : undefined,
      hasta: typeof req.query.hasta === 'string' ? req.query.hasta : undefined,
      id_area,
      id_estado,
      id_prioridad,
    });

    res.json({ success: true, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo generar el reporte';
    res.status(400).json({ success: false, error: message });
  }
};