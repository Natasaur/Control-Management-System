const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config({ path: ".env" });

const PORT = process.env.POST || 3997;
const HOST = process.env.POST || "localhost";

mongoose.set('strictQuery', true); // or false, based on your preference

//se inicia la conexion con la base de datos y con el servidor de la aplicacion pasando las variables declaradas en ./constants.js
async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  );

  app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}/API/${process.env.API_VERSION}`);
  });
}

//ejecuta la funcion de arriba para establecer la conexion
main().catch((err) => console.log(err));