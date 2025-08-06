// Importación de modelos de la base de datos y librerías necesarias

const Asistencia = require("../models/asistencias"); // Modelo que representa los registros de asistencias de los alumnos
const Usuario = require("../models/usuarios"); // Modelo para los usuarios del sistema (administradores, consultores, etc.)
const Fechas_asistencias = require("../models/fechas_asistencias"); // Modelo para las fechas programadas de asistencia
const Alumno = require("../models/alumnos"); // Modelo que representa a los alumnos
const Plantel = require("../models/planteles"); // Modelo que representa los planteles escolares (sedes o campus)
const Carrera = require("../models/carreras"); // Modelo que representa las carreras o programas académicos
const DiasNoLaborables = require("../models/dias_no_laborables"); // Modelo que contiene días festivos o no laborables definidos
const moment = require("moment"); // Librería para el manejo y manipulación de fechas y horas (puede usarse como alternativa a Date)


//CONSULTOR
/*
ESTA FUNCION SIRVE PARA CARGAR LAS ASISTENCIAS DE MANERA INDIVIDUAL EN UN FORMULARIO Y 
TAMBIEN PARA LAS JUSTIFICADAS. EN EL CASO DE LAS JUSTIFICADAS EN EL JSON SE DEBE DAR VALOR
AL ATRIBUTO 'TIPO ASISTENCIA'

LA PROPIA FUNCION YA EVALUA SI EXISTE UNA ASISTENCIA REGISTRADA PREVIAMENTE,
EN CASO DE SER ASI SE CANCELA LA OPERACION
*/
async function crearAsistenciaIndividual(req, res) {
  const { matricula, grupo, ciclo_escolar, fecha, tipo_asistencia } = req.body;

  if (!matricula) res.status(400).send({ msg: "Matricula es requerido" });
  if (!grupo) res.status(400).send({ msg: "Grupo es requerido" });
  if (!ciclo_escolar)
    res.status(400).send({ msg: "Ciclo escolar es requerido" });
  if (!fecha) res.status(400).send({ msg: "Fecha es requerido" });
  if (!tipo_asistencia)
    res.status(400).send({ msg: "Tipo asistencia es requerido" });

  const fechaFormateada = moment(req.body.fecha, "DD/MM/YYYY").toDate();

  const asistencia = new Asistencia({
    matricula: req.body.matricula,
    grupo: req.body.grupo,
    ciclo_escolar: req.body.ciclo_escolar,
    fecha: fechaFormateada,
    tipo_asistencia: req.body.tipo_asistencia,
  });

  const asistenciaExistente = await Asistencia.find({ matricula, fecha });

  if (asistenciaExistente.length === 0) {
    await asistencia.save((error, userStorage) => {
      if (error) {
        res.status(400).send({ msg: "Error al cargar la asistencia" });
        console.log(error);
      } else {
        res.status(200).send(userStorage);
      }
    });
  } else {
    res.status(400).send({
      msg: `Error, ya se encuentra una asistencia registrada con fecha: ${fecha} para el alumno con matrícula: ${matricula}, RESULTADO: ${asistenciaExistente}`,
    });
  }
}

//CONSULTOR
//FUNCION PARA CARGAR UN ARRAY CON LOS OBJETOS JSON DENTRO DE ESTE
//LA PROPIA FUNCION YA EVALUA SI EXISTE UNA ASISTENCIA REGISTRADA PREVIAMENTE, EN CASO DE SER ASI SE CANCELA LA OPERACION
async function crearListaAsistencias(req, res) {
  const asistenciasArray = req.body;

  let matriculasArray = [];
  let fechasArray = [];

  for (var i = 0; i < asistenciasArray.length; i++) {
    matriculasArray.push(asistenciasArray[i].matricula);
    fechasArray.push(asistenciasArray[i].fecha);
  }
  //VARIABLES PARA PODER GUARDAR FECHAS Y MATRICULAS Y COMPROBAR QUE NO HAYAN ASISTENCIAS DUPLICADAS

  const registroDuplicados = await Asistencia.find({
    matricula: { $in: matriculasArray },
    fecha: { $in: fechasArray },
  });

  if (registroDuplicados.length > 0) {
    res.status(400).send({
      msg: "Error, en la lista existe una o mas asistencias que han sido registradas previamente",
    });
  } else {
    try {
      const asistenciasCreadas = await Asistencia.insertMany(asistenciasArray);

      res.status(200).send({
        msg: "Exito al cargar las listas de asistencias ",
        asistenciasCreadas,
      });
    } catch (error) {
      res.status(400).send({ msg: "Error al cargar la lista de asistencias" });
      throw error;
    }
  }
}

//CONSULTOR
//FUNCION PARA ELIMINAR UN REGISTRO DE ASISTENCIA, DEBE DE ENVIARSE COMO ARGUMENTO LA MATRICULA Y FECHA DEL REGISTRO A ELIMINAR
async function eliminarAsistencia(req, res) {
  const { matricula, fecha } = req.body;

  try {
    const asistencia = await Asistencia.findOneAndDelete({
      matricula,
      fecha,
    });

    if (!asistencia) {
      res.status(400).send({ msg: "Error al eliminar asistencia" });
    }

    if (!asistencia.justificada) {
      res.status(403).json({ msg: "Solo se pueden eliminar asistencias justificadas" });
    }

    // Eliminar si está justificada
    await Asistencia.deleteOne({ _id: asistencia._id });

    res.status(200).json({ msg: "Asistencia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar asistencia:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

//CONSULTOR
//FUNCION PARA OBTENER LAS ASISTENCIAS REGISTRADAS POR EL CONSULTOR DE ACUERDO AL DIA. LA MATRICULA QUE SE ENVIA DEBE SER LA DEL CONSULTOR Y LA FECHA DEBE SER LA DEL EL DIA QUE HAYA SELECCIONADO
async function obtenerAsistencia(req, res) {
  const { fechaInicio, fechaFin, tipo_asistencia, grupo, matricula } = req.body || {};

  try {
    let filtro = {};

    if (fechaInicio && fechaFin) {
      filtro.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }

    if (tipo_asistencia) {
      filtro.tipo_asistencia = tipo_asistencia;
    }
    if (grupo) {
      filtro.grupo = grupo;
    }
    if (matricula) {
      filtro.matricula = matricula;
    }

    const asistencias = await Asistencia.find(filtro);
    res.status(200).send(asistencias);
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Error al obtener las asistencias" });
  }
}

//USUARIOS: RECTOR
//FUNCION PARA LA PARTE DE LAS GRAFICAS DONDE MUESTRA EL PORCENTAJE DE ASISTENCIAS POR PLANTEL, PIDE COMO ARGUMENTO LA SEMANA QUE SE DESEE EVALUAR
//LA FUNCION DEVUELVE UN ARRAY DONDE LA POSICION 0 DE LA LISTA ES UN OBJETO JSON CON UN ATRIBUTO CON LAS FECHAS ENCONTRADAS DE ACUERDO A LA SEMANA Y OTRO QUE GUARDA EL NUMERO DE LA CANTIDAD DE FECHAS ENCONTRADAS
//A PARTIR DE LA POSICION 1 HASTA LA POSICION 14 DEL ARRAY SE ENCUENTRAN OBJETOS JSON DONDE CADA UNO CONTIENE ATRIBUTOS NECESARIOS PARA MOSTRAR EL PORCENTAJE EN LAS GRAFICAS
async function porcentajeAsistenciaPlantel(req, res) {
  try {
    const { fechaInicio, fechaFin, plantel } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ msg: "Faltan fechas en el body" });
    }

    // Función para parsear fechas en ISO o DD/MM/YYYY
    function parseFecha(fechaStr) {
      let fecha = moment(fechaStr, moment.ISO_8601, true);
      if (!fecha.isValid()) {
        fecha = moment(fechaStr, "DD/MM/YYYY", true);
      }
      return fecha;
    }

    const fechaInicioMoment = parseFecha(fechaInicio);
    const fechaFinMoment = parseFecha(fechaFin);

    if (!fechaInicioMoment.isValid() || !fechaFinMoment.isValid()) {
      return res.status(400).json({ msg: "Formato de fecha inválido" });
    }

    // Para generar array de fechas, asumiendo que generarFechas acepta objetos Date
    const arrayFechas = generarFechas(fechaInicioMoment.toDate(), fechaFinMoment.toDate());

    let planteles = [];
    if (plantel) {
      planteles = await Plantel.find({ clave: plantel });
    } else {
      planteles = await Plantel.find();
    }

    const diasNoLaborables = await DiasNoLaborables.find({ modalidad: "Escolarizado" });
    const fechasExcluidas = diasNoLaborables.map(d => d.fecha);

    // Asegúrate de que tanto `fechaExcluida` como `f` estén parseadas correctamente
    const fechasFiltradas = arrayFechas.filter(f => {
      const fechaFormateada = moment(f, "YYYY-MM-DD", true);
      return !fechasExcluidas.some(fechaExcluida => {
        const excluidaMoment = moment(fechaExcluida, "YYYY-MM-DD", true);
        return excluidaMoment.isValid() && fechaFormateada.isValid() && excluidaMoment.isSame(fechaFormateada, 'day');
      });
    });

    const fechasLargo = fechasFiltradas.length;

    const alumnos = await Alumno.find();

    // Agrupar alumnos por plantel
    const alumnosPorPlantel = {};
    for (const p of planteles) {
      alumnosPorPlantel[p.clave] = [];
    }
    for (const alumno of alumnos) {
      const letraPlantel = alumno.grupo[1]; // aquí asumo que la clave plantel está en la segunda letra de grupo
      if (alumnosPorPlantel[letraPlantel]) {
        alumnosPorPlantel[letraPlantel].push(alumno.matricula);
      }
    }

    const respuesta = [];

    for (const p of planteles) {
      const alumnosPlantel = alumnosPorPlantel[p.clave] || [];
      const cantidadAlumnos = alumnosPlantel.length;
      const asistenciasMaximas = cantidadAlumnos * fechasLargo;

      let asistenciasRegistradas = 0;
      if (cantidadAlumnos > 0) {
        asistenciasRegistradas = await Asistencia.countDocuments({
          matricula: { $in: alumnosPlantel },
          fecha: { $in: fechasFiltradas }
        });
      }

      const porcentajeAsistencia = asistenciasMaximas
        ? parseFloat(((asistenciasRegistradas * 100) / asistenciasMaximas).toFixed(2))
        : 0;

      respuesta.push({
        plantel: p.nombre,
        cantidadAlumnos,
        asistenciasMaximas,
        asistenciasRegistradas,
        porcentajeAsistencia,
      });
    }

    res.status(200).json({
      fechas: fechasFiltradas,
      cantidadFechas: fechasLargo,
      datos: respuesta,
    });

  } catch (error) {
    console.error("ERROR EN PORCENTAJE ASISTENCIA PLANTEL:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

//USUARIOS: RECTOR
//FUNCION PARA OBTENER EL PORCENTAJE DE ASISTENCIA DE ACUERDO A LA LISTA DE CUATRIMESTRES DE UN PLANTEL EN ESPECIFICO
async function porcentajeAsistenciaCuatrimestre(req, res) {
  try {
    const { plantel, semana } = req.body;

    //FECHAS DE ASISTENCIAS Y LARGO DE CANTIDAD DE ASISTENCIAS
    const fechas = await Fechas_asistencias.find({ semana });
    const fechasLargo = fechas.length;
    const arrayFechas = [];

    //PASAR EL JSON DE ASISTENCIAS A UN ARRAY
    for (var a = 0; a < fechasLargo; a++) {
      arrayFechas.push(fechas[a].fecha);
    }

    //OBTENER LISTA DE ALUMNOS EXISTENTES
    const alumnos = await Alumno.find();

    const alumnosPlantel = [];

    for (var i = 0; i < alumnos.length; i++) {
      switch (alumnos[i].grupo[1]) {
        case plantel:
          alumnosPlantel.push(alumnos[i]);
          break;
      }
    }

    const alumnosPrimero = [];
    const alumnosSegundo = [];
    const alumnosTercero = [];
    const alumnosCuarto = [];
    const alumnosQuinto = [];
    const alumnosSexto = [];
    const alumnosSeptimo = [];
    const alumnosOctavo = [];
    const alumnosNoveno = [];

    for (var j = 0; j < alumnosPlantel.length; j++) {
      switch (alumnosPlantel[j].grupo[0]) {
        case "1":
          alumnosPrimero.push(alumnosPlantel[j].matricula);
          break;
        case "2":
          alumnosSegundo.push(alumnosPlantel[j].matricula);
          break;
        case "3":
          alumnosTercero.push(alumnosPlantel[j].matricula);
          break;
        case "4":
          alumnosCuarto.push(alumnosPlantel[j].matricula);
          break;
        case "5":
          alumnosQuinto.push(alumnosPlantel[j].matricula);
          break;
        case "6":
          alumnosSexto.push(alumnosPlantel[j].matricula);
          break;
        case "7":
          alumnosSeptimo.push(alumnosPlantel[j].matricula);
          break;
        case "8":
          alumnosOctavo.push(alumnosPlantel[j].matricula);
          break;
        case "9":
          alumnosNoveno.push(alumnosPlantel[j].matricula);
          break;

        default:
          break;
      }
    }

    const asistenciasMaximasPrimero = alumnosPrimero.length * fechasLargo;
    const asistenciasMaximasSegundo = alumnosSegundo.length * fechasLargo;
    const asistenciasMaximasTercero = alumnosTercero.length * fechasLargo;
    const asistenciasMaximasCuarto = alumnosCuarto.length * fechasLargo;
    const asistenciasMaximasQuinto = alumnosQuinto.length * fechasLargo;
    const asistenciasMaximasSexto = alumnosSexto.length * fechasLargo;
    const asistenciasMaximasSeptimo = alumnosSeptimo.length * fechasLargo;
    const asistenciasMaximasOctavo = alumnosOctavo.length * fechasLargo;
    const asistenciasMaximasNoveno = alumnosNoveno.length * fechasLargo;

    const asistenciasRegistradasPrimero = await Asistencia.find({
      matricula: { $in: alumnosPrimero },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasSegundo = await Asistencia.find({
      matricula: { $in: alumnosSegundo },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasTercero = await Asistencia.find({
      matricula: { $in: alumnosTercero },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasCuarto = await Asistencia.find({
      matricula: { $in: alumnosCuarto },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasQuinto = await Asistencia.find({
      matricula: { $in: alumnosQuinto },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasSexto = await Asistencia.find({
      matricula: { $in: alumnosSexto },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasSeptimo = await Asistencia.find({
      matricula: { $in: alumnosSeptimo },
      fecha: { $in: arrayFechas },
    });
    [];
    const asistenciasRegistradasOctavo = await Asistencia.find({
      matricula: { $in: alumnosOctavo },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasNoveno = await Asistencia.find({
      matricula: { $in: alumnosNoveno },
      fecha: { $in: arrayFechas },
    });

    const porcentajeAsistenciaPrimero =
      (asistenciasRegistradasPrimero.length * 100) / asistenciasMaximasPrimero;

    const porcentajeAsistenciaSegundo =
      (asistenciasRegistradasSegundo.length * 100) / asistenciasMaximasSegundo;

    const porcentajeAsistenciaTercero =
      (asistenciasRegistradasTercero.length * 100) / asistenciasMaximasTercero;

    const porcentajeAsistenciaCuarto =
      (asistenciasRegistradasCuarto.length * 100) / asistenciasMaximasCuarto;

    const porcentajeAsistenciaQuinto =
      (asistenciasRegistradasQuinto.length * 100) / asistenciasMaximasQuinto;

    const porcentajeAsistenciaSexto =
      (asistenciasRegistradasSexto.length * 100) / asistenciasMaximasSexto;

    const porcentajeAsistenciaSeptimo =
      (asistenciasRegistradasSeptimo.length * 100) / asistenciasMaximasSeptimo;

    const porcentajeAsistenciaOctavo =
      (asistenciasRegistradasOctavo.length * 100) / asistenciasMaximasOctavo;

    const porcentajeAsistenciaNoveno =
      (asistenciasRegistradasNoveno.length * 100) / asistenciasMaximasNoveno;

    const response = [
      {
        fechas: arrayFechas,
        cantidadFechas: fechasLargo,
      },
      {
        cuatrimestre: "PRIMERO",
        cantidadAlumnos: alumnosPrimero.length,
        asistenciasMaximas: asistenciasMaximasPrimero,
        asistenciasRegistradas: asistenciasRegistradasPrimero.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPrimero.toFixed(2)
        ),
      },
      {
        cuatrimestre: "SEGUNDO",
        cantidadAlumnos: alumnosSegundo.length,
        asistenciasMaximas: asistenciasMaximasSegundo,
        asistenciasRegistradas: asistenciasRegistradasSegundo.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaSegundo.toFixed(2)
        ),
      },
      {
        cuatrimestre: "TERCERO",
        cantidadAlumnos: alumnosTercero.length,
        asistenciasMaximas: asistenciasMaximasTercero,
        asistenciasRegistradas: asistenciasRegistradasTercero.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaTercero.toFixed(2)
        ),
      },
      {
        cuatrimestre: "CUARTO",
        cantidadAlumnos: alumnosCuarto.length,
        asistenciasMaximas: asistenciasMaximasCuarto,
        asistenciasRegistradas: asistenciasRegistradasCuarto.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaCuarto.toFixed(2)),
      },
      {
        cuatrimestre: "QUINTO",
        cantidadAlumnos: alumnosQuinto.length,
        asistenciasMaximas: asistenciasMaximasQuinto,
        asistenciasRegistradas: asistenciasRegistradasQuinto.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaQuinto.toFixed(2)),
      },
      {
        cuatrimestre: "SEXTO",
        cantidadAlumnos: alumnosSexto.length,
        asistenciasMaximas: asistenciasMaximasSexto,
        asistenciasRegistradas: asistenciasRegistradasSexto.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaSexto.toFixed(2)),
      },
      {
        cuatrimestre: "SEPTIMO",
        cantidadAlumnos: alumnosSeptimo.length,
        asistenciasMaximas: asistenciasMaximasSeptimo,
        asistenciasRegistradas: asistenciasRegistradasSeptimo.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaSeptimo.toFixed(2)
        ),
      },
      {
        cuatrimestre: "OCTAVO",
        cantidadAlumnos: alumnosOctavo.length,
        asistenciasMaximas: asistenciasMaximasOctavo,
        asistenciasRegistradas: asistenciasRegistradasOctavo.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaOctavo.toFixed(2)),
      },
      {
        cuatrimestre: "NOVENO",
        cantidadAlumnos: alumnosNoveno.length,
        asistenciasMaximas: asistenciasMaximasNoveno,
        asistenciasRegistradas: asistenciasRegistradasNoveno.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaNoveno.toFixed(2)),
      },
    ];

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los datos" });
    throw error;
  }
}

//USUARIOS: RECTOR
//FUNCION PARA OBTENER EL PORCENTAJE DE ASISTENCIA DE ACUERDO A LAS CARRERAS DE ACUERDO A UN PLANTEL EN ESPECIFICO
async function porcentajeAsistenciaCarrera(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ msg: "Faltan fechas en el body" });
    }

    const diasNoLaborables = await DiasNoLaborables.find({
      modalidad: "Escolarizado"
    });

    const fechasExcluidas = diasNoLaborables.map(d => d.fecha);
    const arrayFechas = generarFechas(fechaInicio, fechaFin);

    // Fechas de asistencias
    const fechas = await Fechas_asistencias.find({
      fecha: {
        $in: arrayFechas,
        $nin: fechasExcluidas
      }
    });
    const fechasLargo = fechas.length;

    // Traer carreras
    const carreras = await Carrera.find();

    // Obtener alumnos
    let alumnos = await Alumno.find();

    // Inicializar conteo de carreras
    const conteoCarreras = {};
    for (const carrera of carreras) {
      conteoCarreras[carrera.clave] = 0;
    }

    // Contar alumnos por coincidencia de clave dentro del grupo
    for (const alumno of alumnos) {
      const grupos = Array.isArray(alumno.grupo) ? alumno.grupo : [alumno.grupo];
      for (const carrera of carreras) {
        if (alumno.grupo.includes(carrera.clave)) {
          conteoCarreras[carrera.clave]++;
          break; // si un alumno solo pertenece a una carrera
        }
      }
    }

    //console.log('Carreras:', carreras);
    //console.log('Alumnos:', alumnos);
    //console.log('Conteo por carrera:', conteoCarreras);


    // Preparar respuesta
    const datos = carreras.map(carrera => ({
      carrera: carrera.nombre,
      clave: carrera.clave,
      alumnos: conteoCarreras[carrera.clave] || 0
    }));

    res.status(200).json({
      fechas: arrayFechas,
      cantidadFechas: fechasLargo,
      datos
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Error al obtener los datos" });
    throw error;
  }
}

//FUNCION PARA OBTENER EL PORCENTAJE DE ASISTENCIA POR TURNO POR PLANTEL
async function porcentajeAsistenciaTurno(req, res) {
  try {
    const { plantel, semana } = req.body;

    //FECHAS DE ASISTENCIAS Y LARGO DE CANTIDAD DE ASISTENCIAS
    const fechas = await Fechas_asistencias.find({ semana });
    const fechasLargo = fechas.length;
    const arrayFechas = [];

    //PASAR EL JSON DE ASISTENCIAS A UN ARRAY
    for (var a = 0; a < fechasLargo; a++) {
      arrayFechas.push(fechas[a].fecha);
    }

    //OBTENER LISTA DE ALUMNOS EXISTENTES
    const alumnos = await Alumno.find();

    //SEPARAR A LOS ALUMNOS POR TURNO
    //VARIABLES PARA GUARDAR A LOS ALUMNOS POR TURNO

    const alumnosM = [];
    const alumnosV = [];
    const alumnosN = [];

    for (var i = 0; i < alumnos.length; i++) {
      switch (alumnos[i].grupo[1]) {
        case plantel:
          switch (alumnos[i].grupo[8]) {
            case "M":
              alumnosM.push(alumnos[i].matricula);
              break;
            case "V":
              alumnosV.push(alumnos[i].matricula);
              break;
            case "N":
              alumnosN.push(alumnos[i].matricula);
              break;
              break;
          }
      }
    }

    //ASISTENCIAS MAXIMAS POR TURNO
    const asistenciasMaximasM = alumnosM.length * fechasLargo;
    const asistenciasMaximasV = alumnosV.length * fechasLargo;
    const asistenciasMaximasN = alumnosN.length * fechasLargo;

    //ASISTENCIAS REGISTRADAS POR TUNRO
    const asistenciasRegistradasM = await Asistencia.find({
      matricula: { $in: alumnosM },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasV = await Asistencia.find({
      matricula: { $in: alumnosV },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasN = await Asistencia.find({
      matricula: { $in: alumnosN },
      fecha: { $in: arrayFechas },
    });

    //PORCENTAJE DE ASISTENCIAS POR TURNO
    const porcentajeAsistenciaM =
      (asistenciasRegistradasM.length * 100) / asistenciasMaximasM;
    const porcentajeAsistenciaV =
      (asistenciasRegistradasV.length * 100) / asistenciasMaximasV;
    const porcentajeAsistenciaN =
      (asistenciasRegistradasN.length * 100) / asistenciasMaximasN;

    const response = [
      {
        fechas: arrayFechas,
        cantidadFechas: fechasLargo,
      },
      {
        turno: "MATUTINO",
        cantidadAlumnos: alumnosM.length,
        asistenciasMaximas: asistenciasMaximasM,
        asistenciasRegistradas: asistenciasRegistradasM.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaM.toFixed(2)),
      },
      {
        carrera: "VESPERTINO",
        cantidadAlumnos: alumnosV.length,
        asistenciasMaximas: asistenciasMaximasV,
        asistenciasRegistradas: asistenciasRegistradasV.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaV.toFixed(2)),
      },
      {
        carrera: "NOCTURNO",
        cantidadAlumnos: alumnosN.length,
        asistenciasMaximas: asistenciasMaximasN,
        asistenciasRegistradas: asistenciasRegistradasN.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaN.toFixed(2)),
      },
    ];

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los datos" });
    throw error;
  }
}

//FUNCION PARA OBTENER EL PORCENTAJE DE ASISTENCIA POR GRUPO
async function porcentajeAsistenciaGrupo(req, res) {
  try {
    const { grupo, semana } = req.body;

    //FECHAS DE ASISTENCIAS Y LARGO DE CANTIDAD DE ASISTENCIAS
    const fechas = await Fechas_asistencias.find({ semana });
    const fechasLargo = fechas.length;
    const arrayFechas = [];

    //PASAR EL JSON DE ASISTENCIAS A UN ARRAY
    for (var a = 0; a < fechasLargo; a++) {
      arrayFechas.push(fechas[a].fecha);
    }

    //OBTENER LISTA DE ALUMNOS EXISTENTES DE ACUERDO AL GRUPO INGRESADO
    const alumnos = await Alumno.find({ grupo });
    const alumnosMatricula = [];

    for (var i = 0; i < alumnos.length; i++) {
      alumnosMatricula.push(alumnos[i].matricula);
    }

    const asistenciasMaximas = alumnos.length * fechasLargo;

    const asistenciasRegistradas = await Asistencia.find({
      matricula: { $in: alumnosMatricula },
      fecha: { $in: arrayFechas },
    });

    const porcentajeAsistencia =
      (asistenciasRegistradas.length * 100) / asistenciasMaximas;

    const response = [
      {
        fechas: arrayFechas,
        cantidadFechas: fechasLargo,
      },
      {
        grupo,
        cantidadAlumnos: alumnos.length,
        asistenciasMaximas: asistenciasMaximas,
        asistenciasRegistradas: asistenciasRegistradas.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistencia.toFixed(2)),
      },
    ];

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los datos" });
    throw error;
  }
}

//FUNCION PARA OBTENER EL PORCENTAJE DE ASISTENCIA DE UN ALUMNO EN ESPECIFICO
async function porcentajeAsistenciaAlumno(req, res) {
  try {
    const { matricula, semana } = req.body;

    //FECHAS DE ASISTENCIAS Y LARGO DE CANTIDAD DE ASISTENCIAS
    const fechas = await Fechas_asistencias.find({ semana });
    const fechasLargo = fechas.length;
    const arrayFechas = [];

    //PASAR EL JSON DE ASISTENCIAS A UN ARRAY
    for (var a = 0; a < fechasLargo; a++) {
      arrayFechas.push(fechas[a].fecha);
    }

    //OBTENER LISTA DE ALUMNOS EXISTENTES DE ACUERDO AL GRUPO INGRESADO
    const alumno = await Alumno.findOne({ matricula });

    const asistenciasRegistradas = await Asistencia.find({
      matricula,
      fecha: { $in: arrayFechas },
    });

    const porcentajeAsistencia =
      (asistenciasRegistradas.length * 100) / fechasLargo;

    response = {
      fechas: arrayFechas,
      cantidadFechas: fechasLargo,
      matricula,
      nombre: alumno.nombre,
      apellido_paterno: alumno.apellido_paterno,
      apellido_materno: alumno.apellido_materno,
      grupo: alumno.grupo,
      asistenciasMaximas: fechasLargo,
      asistenciasRegistradas: asistenciasRegistradas.length,
      porcentajeAsistencia: parseFloat(porcentajeAsistencia.toFixed(2)),
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los datos" });
    throw error;
  }
}

async function porcentajeAsistenciaDiario(req, res) {
  try {
    const { fechaInicio, fechaFin, plantel, carrera, grupo } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ msg: "Faltan fechas en el body" });
    }

    const arrayFechas = generarFechas(fechaInicio, fechaFin);

    // --- Armar el filtro correctamente antes de consultar ---
    let alumnosQuery = {};

    if (grupo) {
      alumnosQuery["grupo"] = grupo; // Si hay grupo exacto, se usa directamente
    } else {
      const grupoFiltro = [];
      if (plantel) grupoFiltro.push(`^${plantel}`);
      if (carrera) grupoFiltro.push(`${carrera}$`);
      if (grupoFiltro.length > 0) {
        alumnosQuery["grupo"] = new RegExp(grupoFiltro.join(".*"));
      }
    }

    const alumnos = await Alumno.find(alumnosQuery);

    const datos = [];

    for (const fecha of arrayFechas) {
      const totalAlumnos = alumnos.length;

      let asistenciasRegistradas = 0;
      if (totalAlumnos > 0) {
        asistenciasRegistradas = await Asistencia.countDocuments({
          matricula: { $in: alumnos.map(a => a.matricula) },
          fecha: fecha
        });
      }

      const porcentaje = totalAlumnos > 0
        ? parseFloat(((asistenciasRegistradas * 100) / totalAlumnos).toFixed(2))
        : 0;

      const diaSemana = moment(fecha, "DD/MM/YYYY").format("dddd");

      datos.push({
        fecha,
        diaSemana,
        asistenciasRegistradas,
        alumnosEsperados: totalAlumnos,
        porcentajeAsistencia: porcentaje
      });
    }

    res.status(200).json({
      fechas: arrayFechas,
      datos
    });

  } catch (error) {
    console.log("ERROR EN porcentajeAsistenciaDiario:", error);
    res.status(400).json({ msg: error.message });
  }
}

async function contarAsistenciaPorDia(req, res) {
  const { fechaInicio, fechaFin, plantel, grupo, carrera } = req.body;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ msg: "Faltan fechas en el body" });
  }

  // Función que intenta parsear fecha ISO o DD/MM/YYYY
  function parseFecha(fechaStr) {
    let fecha = moment(fechaStr, moment.ISO_8601, true);
    if (!fecha.isValid()) {
      fecha = moment(fechaStr, "DD/MM/YYYY", true);
    }
    return fecha;
  }

  const fechaInicioMoment = parseFecha(fechaInicio);
  const fechaFinMoment = parseFecha(fechaFin);

  if (!fechaInicioMoment.isValid() || !fechaFinMoment.isValid()) {
    return res.status(400).json({ msg: "Formato de fecha inválido" });
  }

  const fechaInicioDate = fechaInicioMoment.startOf("day").toDate();
  const fechaFinDate = fechaFinMoment.endOf("day").toDate();

  try {
    const asistencias = await Asistencia.find({
      fecha: { $gte: fechaInicioDate, $lte: fechaFinDate },
      ...(plantel ? { plantel } : {}),
      ...(grupo ? { grupo } : {}),
      ...(carrera ? { carrera } : {}),
    });

    // Inicializar conteo por día de la semana en español (capitalizado)
    const diasSemana = {
      "Domingo": 0,
      "Lunes": 0,
      "Martes": 0,
      "Miércoles": 0,
      "Jueves": 0,
      "Viernes": 0,
      "Sábado": 0
    };

    asistencias.forEach(a => {
      const dia = moment(a.fecha).locale('es').format('dddd'); // ej: "lunes"
      const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
      if (diasSemana[diaCapitalizado] !== undefined) {
        diasSemana[diaCapitalizado]++;
      }
    });

    res.json({ asistenciasPorDiaSemana: diasSemana });
  } catch (error) {
    console.error("❌ Error al contar asistencias:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

//-----     NUEVAS FUNCIONES     -------//

async function resumenAsistenciasPorGrupo(req, res) {
  try {
    const {
      grupo,
      fecha_inicio,
      fecha_fin
    } = req.body;

    // total alumnos
    const totalAlumnos = await Alumno.countDocuments({
      grupo
    });

    // días no laborables
    const diasNoLaborables = await DiasNoLaborables.find({
      fecha: { $gte: fecha_inicio, $lte: fecha_fin }
    }).distinct("fecha");

    let fechaCursor = moment(fecha_inicio, "DD/MM/YYYY");
    const fechaFinMoment = moment(fecha_fin, "DD/MM/YYYY");

    const resumen = [];

    while (fechaCursor.isSameOrBefore(fechaFinMoment)) {
      const fechaStr = fechaCursor.format("DD/MM/YYYY");

      if (diasNoLaborables.includes(fechaStr)) {
        fechaCursor.add(1, "day");
        continue;
      }

      const asistenciasDia = await Asistencia.countDocuments({
        grupo,
        fecha: fechaStr,
        tipo_asistencia: { $in: ["normal", "justificada"] }
      });

      resumen.push({
        fecha: fechaStr,
        asistencias: asistenciasDia,
        faltas: totalAlumnos - asistenciasDia
      });

      fechaCursor.add(1, "day");
    }

    return res.json({
      grupo,
      dias: resumen
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el resumen de asistencias." });
  }
}

async function alumnosConFaltas(req, res) {
  try {
    const {
      grupo,
      fecha_inicio,
      fecha_fin,
      min_faltas
    } = req.body;

    const alumnos = await Alumno.find({
      grupo
    });

    const alumnosConFaltas = [];

    for (const alumno of alumnos) {
      const asistencias = await Asistencia.find({
        matricula: alumno.matricula,
        fecha: { $gte: fecha_inicio, $lte: fecha_fin },
        tipo_asistencia: { $in: ["normal", "justificada"] }
      }).distinct("fecha");

      let fechaCursor = moment(fecha_inicio, "DD/MM/YYYY");
      const fechaFinMoment = moment(fecha_fin, "DD/MM/YYYY");
      let faltas = 0;

      while (fechaCursor.isSameOrBefore(fechaFinMoment)) {
        const fechaStr = fechaCursor.format("DD/MM/YYYY");

        if (!asistencias.includes(fechaStr)) {
          faltas++;
        }

        fechaCursor.add(1, "day");
      }

      if (faltas >= parseInt(min_faltas)) {
        alumnosConFaltas.push({
          matricula: alumno.matricula,
          nombre: `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`,
          grupo: alumno.grupo,
          faltas
        });
      }
    }

    return res.json(alumnosConFaltas);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener alumnos con faltas." });
  }
}

async function contarFaltasPorAlumno(req, res) {
  const { fechaInicio, fechaFin, grupo, plantel, carrera } = req.body;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ msg: "Faltan fechas" });
  }

  // Función que intenta parsear fecha ISO o DD/MM/YYYY
  function parseFecha(fechaStr) {
    let fecha = moment(fechaStr, moment.ISO_8601, true);
    if (!fecha.isValid()) {
      fecha = moment(fechaStr, "DD/MM/YYYY", true);
    }
    return fecha;
  }

  const fechaInicioMoment = parseFecha(fechaInicio);
  const fechaFinMoment = parseFecha(fechaFin);

  if (!fechaInicioMoment.isValid() || !fechaFinMoment.isValid()) {
    return res.status(400).json({ msg: "Formato de fecha inválido" });
  }

  const fechaInicioDate = fechaInicioMoment.startOf("day").toDate();
  const fechaFinDate = fechaFinMoment.endOf("day").toDate();
  try {
    const asistencias = await Asistencia.find({
      fecha: { $gte: fechaInicioDate, $lte: fechaFinDate },
      ...(plantel ? { plantel } : {}),
      ...(grupo ? { grupo } : {}),
      ...(carrera ? { carrera } : {}),
    });

    // Generar las fechas en el rango
    const fechas = generarFechas(fechaInicioDate, fechaFinDate);

    let masDeTres = 0;
    let tresOMenos = 0;

    for (const asistencia of asistencias) {
      let asistenciasAlumno = await Asistencia.find({
        matricula: asistencia.matricula,
        fecha: { $gte: fechaInicioDate, $lte: fechaFinDate }
      });

      const asistenciasRegistradas = asistenciasAlumno.length;
      const totalEsperado = fechas.length;
      const faltas = totalEsperado - asistenciasRegistradas;

      if (faltas > 3) {
        masDeTres++;
      } else {
        tresOMenos++;
      }
    }

    res.json({
      masDeTresFaltas: masDeTres,
      tresOFaltasMenos: tresOMenos
    });
  } catch (error) {
    console.error("Error en contarFaltasPorAlumno:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

function generarFechas(fechaInicio, fechaFin) {
  const fechas = [];
  let inicio = moment(fechaInicio, "DD/MM/YYYY"); // o "YYYY-MM-DD"
  const fin = moment(fechaFin, "DD/MM/YYYY");
  while (inicio <= fin) {
    fechas.push(inicio.toDate());
    inicio.add(1, 'days');
  }
  return fechas;
}

const filtrarPorGrupo = async (req, res) => {
  try {
    const { grupo, fechaInicio, fechaFin } = req.body;

    if (!grupo) {
      return res.status(400).json({ error: "El grupo es obligatorio." });
    }

    const filtro = { grupo };

    if (fechaInicio && fechaFin) {
      filtro.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }

    const asistencias = await Asistencia.find(filtro);
    res.status(200).json(asistencias);
  } catch (error) {
    console.error("Error al filtrar asistencias:", error);
    res.status(500).json({ error: "Error al filtrar asistencias por grupo." });
  }
};

// Obtener asistencias justificadas
const obtenerJustificadas = async (req, res) => {
  try {
    const asistencias = await Asistencia.find({ tipo_asistencia: "justificada" }) // <-- aquí el filtro correcto
      .select("matricula grupo ciclo_escolar fecha") // <-- seleccionamos solo los campos necesarios
      .sort({ fecha: -1 }); // orden descendente por fecha, opcional

    //console.log(`Se encontraron ${asistencias.length} asistencias justificadas`);
    res.status(200).json(asistencias);
  } catch (error) {
    console.error("Error al filtrar asistencias justificadas:", error);
    res.status(500).json({ error: "Error al filtrar asistencias justificadas." });
  }
};

module.exports = {
  crearAsistenciaIndividual,
  crearListaAsistencias,
  eliminarAsistencia,
  obtenerAsistencia,
  porcentajeAsistenciaPlantel,
  porcentajeAsistenciaCuatrimestre,
  porcentajeAsistenciaCarrera,
  porcentajeAsistenciaTurno,
  porcentajeAsistenciaGrupo,
  porcentajeAsistenciaAlumno,
  porcentajeAsistenciaDiario,
  resumenAsistenciasPorGrupo,
  alumnosConFaltas,
  contarAsistenciaPorDia,
  contarFaltasPorAlumno,
  filtrarPorGrupo,
  obtenerJustificadas,
};