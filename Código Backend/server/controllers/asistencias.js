const Asistencia = require("../models/asistencias");
const Usuario = require("../models/usuarios");
const Fechas_asistencias = require("../models/fechas_asistencias");
const Alumno = require("../models/alumnos");

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

  const asistencia = new Asistencia({
    matricula,
    grupo,
    ciclo_escolar,
    fecha,
    tipo_asistencia,
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

  //VARIABLES PARA PODER GUARDAR FECHAS Y MATRICULAS Y COMPROBAR QUE NO HAYAN ASISTENCIAS DUPLICADAS
  let matriculasArray = [];
  let fechasArray = [];

  for (var i = 0; i < asistenciasArray.length; i++) {
    matriculasArray.push(asistenciasArray[i].matricula);
    fechasArray.push(asistenciasArray[i].fecha);
  }

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
    const asistenciaEliminada = await Asistencia.findOneAndDelete({
      matricula,
      fecha,
    });

    if (!asistenciaEliminada) {
      res.status(400).send({ msg: "Error al eliminar asistencia" });
    } else {
      res.status(200).send({ msg: "Asistencia eliminada" });
    }
  } catch (error) {
    throw error;
  }
}

//CONSULTOR
//FUNCION PARA OBTENER LAS ASISTENCIAS REGISTRADAS POR EL CONSULTOR DE ACUERDO AL DIA. LA MATRICULA QUE SE ENVIA DEBE SER LA DEL CONSULTOR Y LA FECHA DEBE SER LA DEL EL DIA QUE HAYA SELECCIONADO
async function obtenerAsistencia(req, res) {
  const { matricula, fecha } = req.body;
  let asistencias = [];

  try {
    const busquedaGrupos = await Usuario.findOne({ matricula });

    const arrayGrupos = busquedaGrupos.grupos;

    for (let i = 0; i < arrayGrupos.length; i++) {
      let busqueda = await Asistencia.find({ grupo: arrayGrupos[i], fecha });

      for (let j = 0; j < busqueda.length; j++) {
        asistencias.push(busqueda[j]);
      }
    }

    res.status(200).send(asistencias);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener las asistencias" });
    throw error;
  }
}

//USUARIOS: RECTOR
//FUNCION PARA LA PARTE DE LAS GRAFICAS DONDE MUESTRA EL PORCENTAJE DE ASISTENCIAS POR PLANTEL, PIDE COMO ARGUMENTO LA SEMANA QUE SE DESEE EVALUAR
//LA FUNCION DEVUELVE UN ARRAY DONDE LA POSICION 0 DE LA LISTA ES UN OBJETO JSON CON UN ATRIBUTO CON LAS FECHAS ENCONTRADAS DE ACUERDO A LA SEMANA Y OTRO QUE GUARDA EL NUMERO DE LA CANTIDAD DE FECHAS ENCONTRADAS
//A PARTIR DE LA POSICION 1 HASTA LA POSICION 14 DEL ARRAY SE ENCUENTRAN OBJETOS JSON DONDE CADA UNO CONTIENE ATRIBUTOS NECESARIOS PARA MOSTRAR EL PORCENTAJE EN LAS GRAFICAS
async function porcentajeAsistenciaPlantel(req, res) {
  try {
    const { semana } = req.body;

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

    //ARREGLOS PARA GUARDAR LA MATRICULA DE LOS ALUMNOS POR PLANTEL
    const alumnosA = [];
    const alumnosH = [];
    const alumnosC = [];
    const alumnosU = [];
    const alumnosE = [];
    const alumnosX = [];
    const alumnosI = [];
    const alumnosN = [];
    const alumnosR = [];
    const alumnosT = [];
    const alumnosS = [];
    const alumnosZ = [];
    const alumnosV = [];

    //GUARDAR LAS MATRICULAS DE LOS ALUMNOS EN ARRAYS DE ACUERDO AL PLANTEL AL QUE PERTENECEN
    for (var i = 0; i < alumnos.length; i++) {
      switch (alumnos[i].grupo[1]) {
        case "A":
          alumnosA.push(alumnos[i].matricula);
          break;

        case "H":
          alumnosH.push(alumnos[i].matricula);
          break;

        case "C":
          alumnosC.push(alumnos[i].matricula);
          break;

        case "U":
          alumnosU.push(alumnos[i].matricula);
          break;

        case "E":
          alumnosE.push(alumnos[i].matricula);
          break;

        case "X":
          alumnosX.push(alumnos[i].matricula);
          break;

        case "I":
          alumnosI.push(alumnos[i].matricula);
          break;

        case "N":
          alumnosN.push(alumnos[i].matricula);
          break;

        case "R":
          alumnosR.push(alumnos[i].matricula);
          break;

        case "T":
          alumnosT.push(alumnos[i].matricula);
          break;

        case "S":
          alumnosS.push(alumnos[i].matricula);
          break;

        case "Z":
          alumnosZ.push(alumnos[i].matricula);
          break;

        case "V":
          alumnosV.push(alumnos[i].matricula);
          break;
        default:
          break;
      }
    }

    //CONSTANTES DONDE SE GUARDA LA CANTIDAD DE ALUMNOS ENCONTRADOS
    const cantidadAlumnosA = alumnosA.length;
    const cantidadAlumnosH = alumnosH.length;
    const cantidadAlumnosC = alumnosC.length;
    const cantidadAlumnosU = alumnosU.length;
    const cantidadAlumnosE = alumnosE.length;
    const cantidadAlumnosX = alumnosX.length;
    const cantidadAlumnosI = alumnosI.length;
    const cantidadAlumnosN = alumnosN.length;
    const cantidadAlumnosR = alumnosR.length;
    const cantidadAlumnosT = alumnosT.length;
    const cantidadAlumnosS = alumnosS.length;
    const cantidadAlumnosZ = alumnosZ.length;
    const cantidadAlumnosV = alumnosV.length;

    //VARIABLES PARA GUARDAR LA CANTIDAD MAXIMA DE ASISTENCIAS DE ACUERDO AL PLANTEL
    const asistenciasMaximasA = cantidadAlumnosA * fechasLargo;
    const asistenciasMaximasH = cantidadAlumnosH * fechasLargo;
    const asistenciasMaximasC = cantidadAlumnosC * fechasLargo;
    const asistenciasMaximasU = cantidadAlumnosU * fechasLargo;
    const asistenciasMaximasE = cantidadAlumnosE * fechasLargo;
    const asistenciasMaximasX = cantidadAlumnosX * fechasLargo;
    const asistenciasMaximasI = cantidadAlumnosI * fechasLargo;
    const asistenciasMaximasN = cantidadAlumnosN * fechasLargo;
    const asistenciasMaximasR = cantidadAlumnosR * fechasLargo;
    const asistenciasMaximasT = cantidadAlumnosT * fechasLargo;
    const asistenciasMaximasS = cantidadAlumnosS * fechasLargo;
    const asistenciasMaximasZ = cantidadAlumnosZ * fechasLargo;
    const asistenciasMaximasV = cantidadAlumnosV * fechasLargo;

    //BUSCAR Y GUARDAR LA CANTIDAD DE ASISTENCIAS REGISTRADAS POR MATRICULAS Y PLANTEL
    const asistenciasRegistradasPlantelA = await Asistencia.find({
      matricula: { $in: alumnosA },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelH = await Asistencia.find({
      matricula: { $in: alumnosH },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelC = await Asistencia.find({
      matricula: { $in: alumnosC },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelU = await Asistencia.find({
      matricula: { $in: alumnosU },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelE = await Asistencia.find({
      matricula: { $in: alumnosE },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelX = await Asistencia.find({
      matricula: { $in: alumnosX },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelI = await Asistencia.find({
      matricula: { $in: alumnosI },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelN = await Asistencia.find({
      matricula: { $in: alumnosN },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelR = await Asistencia.find({
      matricula: { $in: alumnosR },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelT = await Asistencia.find({
      matricula: { $in: alumnosT },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelS = await Asistencia.find({
      matricula: { $in: alumnosS },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelZ = await Asistencia.find({
      matricula: { $in: alumnosZ },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPlantelV = await Asistencia.find({
      matricula: { $in: alumnosV },
      fecha: { $in: arrayFechas },
    });

    //PORCENTAJES DE ASISTENCIAS POR PLANTEL
    const porcentajeAsistenciaPlantelA =
      (asistenciasRegistradasPlantelA.length * 100) / asistenciasMaximasA;

    const porcentajeAsistenciaPlantelH =
      (asistenciasRegistradasPlantelH.length * 100) / asistenciasMaximasH;

    const porcentajeAsistenciaPlantelC =
      (asistenciasRegistradasPlantelC.length * 100) / asistenciasMaximasC;

    const porcentajeAsistenciaPlantelU =
      (asistenciasRegistradasPlantelU.length * 100) / asistenciasMaximasU;

    const porcentajeAsistenciaPlantelE =
      (asistenciasRegistradasPlantelE.length * 100) / asistenciasMaximasE;

    const porcentajeAsistenciaPlantelX =
      (asistenciasRegistradasPlantelX.length * 100) / asistenciasMaximasX;

    const porcentajeAsistenciaPlantelI =
      (asistenciasRegistradasPlantelI.length * 100) / asistenciasMaximasI;

    const porcentajeAsistenciaPlantelN =
      (asistenciasRegistradasPlantelN.length * 100) / asistenciasMaximasN;

    const porcentajeAsistenciaPlantelR =
      (asistenciasRegistradasPlantelR.length * 100) / asistenciasMaximasR;

    const porcentajeAsistenciaPlantelT =
      (asistenciasRegistradasPlantelT.length * 100) / asistenciasMaximasT;

    const porcentajeAsistenciaPlantelS =
      (asistenciasRegistradasPlantelS.length * 100) / asistenciasMaximasS;

    const porcentajeAsistenciaPlantelZ =
      (asistenciasRegistradasPlantelZ.length * 100) / asistenciasMaximasZ;

    const porcentajeAsistenciaPlantelV =
      (asistenciasRegistradasPlantelV.length * 100) / asistenciasMaximasV;

    const response = [
      {
        fechas: arrayFechas,
        cantidadFechas: fechasLargo,
      },
      {
        plantel: "ATIZAPAN",
        cantidadAlumnos: cantidadAlumnosA,
        asistenciasMaximas: asistenciasMaximasA,
        aistenciasRegistradas: asistenciasRegistradasPlantelA.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelA.toFixed(2)
        ),
      },
      {
        plantel: "CHALCO",
        cantidadAlumnos: cantidadAlumnosH,
        asistenciasMaximas: asistenciasMaximasH,
        aistenciasRegistradas: asistenciasRegistradasPlantelH.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelH.toFixed(2)
        ),
      },
      {
        plantel: "COACALCO",
        cantidadAlumnos: cantidadAlumnosC,
        asistenciasMaximas: asistenciasMaximasC,
        aistenciasRegistradas: asistenciasRegistradasPlantelC.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelC.toFixed(2)
        ),
      },
      {
        plantel: "CUAUTITLAN",
        cantidadAlumnos: cantidadAlumnosU,
        asistenciasMaximas: asistenciasMaximasU,
        aistenciasRegistradas: asistenciasRegistradasPlantelU.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelU.toFixed(2)
        ),
      },
      {
        plantel: "ECATEPEC",
        cantidadAlumnos: cantidadAlumnosE,
        asistenciasMaximas: asistenciasMaximasE,
        aistenciasRegistradas: asistenciasRegistradasPlantelE.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelE.toFixed(2)
        ),
      },
      {
        plantel: "IXTAPALUCA",
        cantidadAlumnos: cantidadAlumnosX,
        asistenciasMaximas: asistenciasMaximasX,
        aistenciasRegistradas: asistenciasRegistradasPlantelX.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelX.toFixed(2)
        ),
      },
      {
        plantel: "IZTAPALAPA",
        cantidadAlumnos: cantidadAlumnosI,
        asistenciasMaximas: asistenciasMaximasI,
        aistenciasRegistradas: asistenciasRegistradasPlantelI.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelI.toFixed(2)
        ),
      },
      {
        plantel: "NEZA",
        cantidadAlumnos: cantidadAlumnosN,
        asistenciasMaximas: asistenciasMaximasN,
        aistenciasRegistradas: asistenciasRegistradasPlantelN.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelN.toFixed(2)
        ),
      },
      {
        plantel: "REYES",
        cantidadAlumnos: cantidadAlumnosR,
        asistenciasMaximas: asistenciasMaximasR,
        aistenciasRegistradas: asistenciasRegistradasPlantelR.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelR.toFixed(2)
        ),
      },
      {
        plantel: "TOLUCA",
        cantidadAlumnos: cantidadAlumnosT,
        asistenciasMaximas: asistenciasMaximasT,
        aistenciasRegistradas: asistenciasRegistradasPlantelT.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelT.toFixed(2)
        ),
      },
      {
        plantel: "TOREO",
        cantidadAlumnos: cantidadAlumnosS,
        asistenciasMaximas: asistenciasMaximasS,
        aistenciasRegistradas: asistenciasRegistradasPlantelS.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelS.toFixed(2)
        ),
      },
      {
        plantel: "ZONA ROSA",
        cantidadAlumnos: cantidadAlumnosZ,
        asistenciasMaximas: asistenciasMaximasZ,
        aistenciasRegistradas: asistenciasRegistradasPlantelZ.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelZ.toFixed(2)
        ),
      },
      {
        plantel: "HAVRE",
        cantidadAlumnos: cantidadAlumnosV,
        asistenciasMaximas: asistenciasMaximasV,
        aistenciasRegistradas: asistenciasRegistradasPlantelV.length,
        porcentajeAsistencia: parseFloat(
          porcentajeAsistenciaPlantelV.toFixed(2)
        ),
      },
    ];

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los datos" });
    throw error;
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

    //usando un substring guarda en una variable la carrera del alumno que esta en su grupo, antes crea un array con toda la lista de grupos y varias variables por todas las carreras
    //para que de acuerdo al caso de la carrera a la que pertenezca se guarden ahi sus datos
    const carreraINFO = [];
    const carreraINAD = [];
    const carreraADMI = [];
    const carreraTURI = [];
    const carreraDIGR = [];
    const carreraARQU = [];
    const carreraPEDA = [];
    const carreraINSC = [];
    const carreraDERE = [];
    const carreraCOFI = [];
    const carreraADME = [];
    const carreraMERC = [];
    const carreraCRIM = [];
    const carreraCOIN = [];
    const carreraADMP = [];
    const carreraDOES = [];
    const carreraADMN = [];

    for (var i = 0; i < alumnos.length; i++) {
      switch (alumnos[i].grupo[1]) {
        case plantel:
          let carrera = alumnos[i].grupo.substring(4, 8);
          switch (carrera) {
            case "INFO":
              carreraINFO.push(alumnos[i].matricula);
              break;
            case "INAD":
              carreraINAD.push(alumnos[i].matricula);
              break;
            case "ADMI":
              carreraADMI.push(alumnos[i].matricula);
              break;
            case "TURI":
              carreraTURI.push(alumnos[i].matricula);
              break;
            case "DIGR":
              carreraDIGR.push(alumnos[i].matricula);
              break;
            case "ARQU":
              carreraARQU.push(alumnos[i].matricula);
              break;
            case "PEDA":
              carreraPEDA.push(alumnos[i].matricula);
              break;
            case "INSC":
              carreraINSC.push(alumnos[i].matricula);
              break;
            case "DERE":
              carreraDERE.push(alumnos[i].matricula);
              break;
            case "COFI":
              carreraCOFI.push(alumnos[i].matricula);
              break;
            case "ADME":
              carreraADME.push(alumnos[i].matricula);
              break;
            case "MERC":
              carreraMERC.push(alumnos[i].matricula);
              break;
            case "CRIM":
              carreraCRIM.push(alumnos[i].matricula);
              break;
            case "COIN":
              carreraCOIN.push(alumnos[i].matricula);
              break;
            case "ADMP":
              carreraADMP.push(alumnos[i].matricula);
              break;
            case "DOES":
              carreraDOES.push(alumnos[i].matricula);
              break;
            case "ADMN":
              carreraADMN.push(alumnos[i].matricula);
              break;
          }

          break;
      }
    }

    //CONSTANTE QUE ALMACENA EL NUMERO MAXIMO DE ASISTENCIAS POR CARRERA PARA COMPLETAR EL 100 POR CIENTO
    const asistenciasMaximasINFO = carreraINFO.length * fechasLargo;
    const asistenciasMaximasINAD = carreraINAD.length * fechasLargo;
    const asistenciasMaximasADMI = carreraADMI.length * fechasLargo;
    const asistenciasMaximasTURI = carreraTURI.length * fechasLargo;
    const asistenciasMaximasDIGR = carreraDIGR.length * fechasLargo;
    const asistenciasMaximasARQU = carreraARQU.length * fechasLargo;
    const asistenciasMaximasPEDA = carreraPEDA.length * fechasLargo;
    const asistenciasMaximasINSC = carreraINSC.length * fechasLargo;
    const asistenciasMaximasDERE = carreraDERE.length * fechasLargo;
    const asistenciasMaximasCOFI = carreraCOFI.length * fechasLargo;
    const asistenciasMaximasADME = carreraADME.length * fechasLargo;
    const asistenciasMaximasMERC = carreraMERC.length * fechasLargo;
    const asistenciasMaximasCRIM = carreraCRIM.length * fechasLargo;
    const asistenciasMaximasCOIN = carreraCOIN.length * fechasLargo;
    const asistenciasMaximasADMP = carreraADMP.length * fechasLargo;
    const asistenciasMaximasDOES = carreraDOES.length * fechasLargo;
    const asistenciasMaximasADMN = carreraADMN.length * fechasLargo;

    //BUSQUEDA DE REGISTROS DE ASISTENCIA POR CARRERA
    const asistenciasRegistradasINFO = await Asistencia.find({
      matricula: { $in: carreraINFO },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasINAD = await Asistencia.find({
      matricula: { $in: carreraINAD },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasADMI = await Asistencia.find({
      matricula: { $in: carreraADMI },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasTURI = await Asistencia.find({
      matricula: { $in: carreraTURI },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasDIGR = await Asistencia.find({
      matricula: { $in: carreraDIGR },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasARQU = await Asistencia.find({
      matricula: { $in: carreraARQU },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasPEDA = await Asistencia.find({
      matricula: { $in: carreraPEDA },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasINSC = await Asistencia.find({
      matricula: { $in: carreraINSC },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasDERE = await Asistencia.find({
      matricula: { $in: carreraDERE },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasCOFI = await Asistencia.find({
      matricula: { $in: carreraCOFI },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasADME = await Asistencia.find({
      matricula: { $in: carreraADME },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasMERC = await Asistencia.find({
      matricula: { $in: carreraMERC },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasCRIM = await Asistencia.find({
      matricula: { $in: carreraCRIM },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasCOIN = await Asistencia.find({
      matricula: { $in: carreraCOIN },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasADMP = await Asistencia.find({
      matricula: { $in: carreraADMP },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasDOES = await Asistencia.find({
      matricula: { $in: carreraDOES },
      fecha: { $in: arrayFechas },
    });
    const asistenciasRegistradasADMN = await Asistencia.find({
      matricula: { $in: carreraADMN },
      fecha: { $in: arrayFechas },
    });

    //CALCULO DEL PORCENTAJE DE ASISTENCIA
    const porcentajeAsistenciaINFO =
      (asistenciasRegistradasINFO.length * 100) / asistenciasMaximasINFO;
    const porcentajeAsistenciaINAD =
      (asistenciasRegistradasINAD.length * 100) / asistenciasMaximasINAD;
    const porcentajeAsistenciaADMI =
      (asistenciasRegistradasADMI.length * 100) / asistenciasMaximasADMI;
    const porcentajeAsistenciaTURI =
      (asistenciasRegistradasTURI.length * 100) / asistenciasMaximasTURI;
    const porcentajeAsistenciaDIGR =
      (asistenciasRegistradasDIGR.length * 100) / asistenciasMaximasDIGR;
    const porcentajeAsistenciaARQU =
      (asistenciasRegistradasARQU.length * 100) / asistenciasMaximasARQU;
    const porcentajeAsistenciaPEDA =
      (asistenciasRegistradasPEDA.length * 100) / asistenciasMaximasPEDA;
    const porcentajeAsistenciaINSC =
      (asistenciasRegistradasINSC.length * 100) / asistenciasMaximasINSC;
    const porcentajeAsistenciaDERE =
      (asistenciasRegistradasDERE.length * 100) / asistenciasMaximasDERE;
    const porcentajeAsistenciaCOFI =
      (asistenciasRegistradasCOFI.length * 100) / asistenciasMaximasCOFI;
    const porcentajeAsistenciaADME =
      (asistenciasRegistradasADME.length * 100) / asistenciasMaximasADME;
    const porcentajeAsistenciaMERC =
      (asistenciasRegistradasMERC.length * 100) / asistenciasMaximasMERC;
    const porcentajeAsistenciaCRIM =
      (asistenciasRegistradasCRIM.length * 100) / asistenciasMaximasCRIM;
    const porcentajeAsistenciaCOIN =
      (asistenciasRegistradasCOIN.length * 100) / asistenciasMaximasCOIN;
    const porcentajeAsistenciaADMP =
      (asistenciasRegistradasADMP.length * 100) / asistenciasMaximasADMP;
    const porcentajeAsistenciaDOES =
      (asistenciasRegistradasDOES.length * 100) / asistenciasMaximasDOES;
    const porcentajeAsistenciaADMN =
      (asistenciasRegistradasADMN.length * 100) / asistenciasMaximasADMN;

    const response = [
      {
        fechas: arrayFechas,
        cantidadFechas: fechasLargo,
      },
      {
        carrera: "INFORMATICA",
        cantidadAlumnos: carreraINFO.length,
        asistenciasMaximas: asistenciasMaximasINFO,
        asistenciasRegistradas: asistenciasRegistradasINFO.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaINFO.toFixed(2)),
      },
      {
        carrera: "INFORMATICA ADMINISTRATIVA",
        cantidadAlumnos: carreraINAD.length,
        asistenciasMaximas: asistenciasMaximasINAD,
        asistenciasRegistradas: asistenciasRegistradasINAD.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaINAD.toFixed(2)),
      },
      {
        carrera: "ADMINISTRACION",
        cantidadAlumnos: carreraADMI.length,
        asistenciasMaximas: asistenciasMaximasADMI,
        asistenciasRegistradas: asistenciasRegistradasADMI.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaADMI.toFixed(2)),
      },
      {
        carrera: "TURISMO",
        cantidadAlumnos: carreraTURI.length,
        asistenciasMaximas: asistenciasMaximasTURI,
        asistenciasRegistradas: asistenciasRegistradasTURI.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaTURI.toFixed(2)),
      },
      {
        carrera: "DISEÑO GRAFICO",
        cantidadAlumnos: carreraDIGR.length,
        asistenciasMaximas: asistenciasMaximasDIGR,
        asistenciasRegistradas: asistenciasRegistradasDIGR.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaDIGR.toFixed(2)),
      },
      {
        carrera: "ARQUITECTURA",
        cantidadAlumnos: carreraARQU.length,
        asistenciasMaximas: asistenciasMaximasARQU,
        asistenciasRegistradas: asistenciasRegistradasARQU.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaARQU.toFixed(2)),
      },
      {
        carrera: "PEDAGOGIA",
        cantidadAlumnos: carreraPEDA.length,
        asistenciasMaximas: asistenciasMaximasPEDA,
        asistenciasRegistradas: asistenciasRegistradasPEDA.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaPEDA.toFixed(2)),
      },
      {
        carrera: "INGENIERIA EN SISTEMAS COMPUTACIONALES",
        cantidadAlumnos: carreraINSC.length,
        asistenciasMaximas: asistenciasMaximasINSC,
        asistenciasRegistradas: asistenciasRegistradasINSC.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaINSC.toFixed(2)),
      },
      {
        carrera: "DERECHO",
        cantidadAlumnos: carreraDERE.length,
        asistenciasMaximas: asistenciasMaximasDERE,
        asistenciasRegistradas: asistenciasRegistradasDERE.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaDERE.toFixed(2)),
      },
      {
        carrera: "CONTADURIA Y FINANZAS",
        cantidadAlumnos: carreraCOFI.length,
        asistenciasMaximas: asistenciasMaximasCOFI,
        asistenciasRegistradas: asistenciasRegistradasCOFI.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaCOFI.toFixed(2)),
      },
      {
        carrera: "ADMINISTRACION DE EMRPESAS",
        cantidadAlumnos: carreraADME.length,
        asistenciasMaximas: asistenciasMaximasADME,
        asistenciasRegistradas: asistenciasRegistradasADME.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaADME.toFixed(2)),
      },
      {
        carrera: "MERCADOTECNIA",
        cantidadAlumnos: carreraMERC.length,
        asistenciasMaximas: asistenciasMaximasMERC,
        asistenciasRegistradas: asistenciasRegistradasMERC.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaMERC.toFixed(2)),
      },
      {
        carrera: "CRIMINALISTICA",
        cantidadAlumnos: carreraCRIM.length,
        asistenciasMaximas: asistenciasMaximasCRIM,
        asistenciasRegistradas: asistenciasRegistradasCRIM.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaCRIM.toFixed(2)),
      },
      {
        carrera: "COMERCIO INTERNACIONAL",
        cantidadAlumnos: carreraCOIN.length,
        asistenciasMaximas: asistenciasMaximasCOIN,
        asistenciasRegistradas: asistenciasRegistradasCOIN.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaCOIN.toFixed(2)),
      },
      {
        carrera: "ADMINISTRACION PUBLICA",
        cantidadAlumnos: carreraADMP.length,
        asistenciasMaximas: asistenciasMaximasADMP,
        asistenciasRegistradas: asistenciasRegistradasADMP.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaADMP.toFixed(2)),
      },
      {
        carrera: "DOCENCIA EN EDUCACION SUPERIOR",
        cantidadAlumnos: carreraDOES.length,
        asistenciasMaximas: asistenciasMaximasDOES,
        asistenciasRegistradas: asistenciasRegistradasDOES.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaDOES.toFixed(2)),
      },
      {
        carrera: "ADMINISTRACION Y NEGOCIOS",
        cantidadAlumnos: carreraADMN.length,
        asistenciasMaximas: asistenciasMaximasADMN,
        asistenciasRegistradas: asistenciasRegistradasADMN.length,
        porcentajeAsistencia: parseFloat(porcentajeAsistenciaADMN.toFixed(2)),
      },
    ];

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los datos" });
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

async function saludar() {
  console.log("Hola buenas como estan");
}

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
  saludar,
};