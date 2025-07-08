const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });

const app = express();

//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import routings
const usuarioRoutes = require("./router/usuarios");
const alumnoRoutes = require("./router/alumnos");
const asistenciasRoutes = require("./router/asistencias");
const fechasRoutes = require("./router/fechas_asistencias");
const gruposRoutes = require("./router/grupos");
const authRoutes = require("./router/auth");
const alertasRoutes = require("./router/alertas");

// configure static folder
// EJEMPLO app.use(express.static("uploads"));

//configure header http - cors
app.use(cors());

//configure routings
app.use(`/API/${process.env.API_VERSION}`, usuarioRoutes);
app.use(`/API/${process.env.API_VERSION}`, alumnoRoutes);
app.use(`/API/${process.env.API_VERSION}`, asistenciasRoutes);
app.use(`/API/${process.env.API_VERSION}`, fechasRoutes);
app.use(`/API/${process.env.API_VERSION}`, gruposRoutes);
app.use(`/API/${process.env.API_VERSION}`, authRoutes);
app.use(`/API/${process.env.API_VERSION}`, alertasRoutes);

//const cron = require("node-cron");
const { saludar } = require("./controllers/asistencias");
const alertas = require("./models/alertas");

/*cron.schedule("* * * * * *", () => {
  saludar();
});*/

module.exports = app;