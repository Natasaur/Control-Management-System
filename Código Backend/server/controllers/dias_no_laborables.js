const DiaNoLaborable = require("../models/dias_no_laborables");

async function crearDiaNoLaborable(req, res) {
  try {
    const { fecha, modalidad, motivo } = req.body;

    if (!fecha || !modalidad || !motivo) {
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    const existente = await DiaNoLaborable.findOne({
      fecha: { $gte: startOfDay, $lte: endOfDay },
      modalidad,
    });

    if (existente) {
      return res.status(400).json({ message: "Ya existe un día no laborable con esa fecha y modalidad." });
    }

    const nuevoDia = new DiaNoLaborable({
      fecha: startOfDay,
      modalidad,
      motivo,
    });

    await nuevoDia.save();
    res.status(201).json({ message: "Día no laborable guardado correctamente." });
  } catch (error) {
    console.error("Error al crear día no laborable:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
}

async function obtenerDiasNoLaborables(req, res) {
  try {
    const { fechaInicio, fechaFin, modalidad } = req.query;

    const filtro = {};
    if (fechaInicio && fechaFin) {
      filtro.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }
    if (modalidad) {
      filtro.modalidad = modalidad;
    }

    const dias = await DiaNoLaborable.find(filtro);
    res.status(200).json(dias);
  } catch (error) {
    console.error("Error al obtener días no laborables:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
}

module.exports = {
  crearDiaNoLaborable,
  obtenerDiasNoLaborables,
};