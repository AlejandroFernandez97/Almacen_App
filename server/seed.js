const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Definimos el esquema básico para asegurar la creación directa
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function crearPrimerUsuario() {
  try {
    // Conectar usando tu URI del archivo .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Conectado a MongoDB para la creación del usuario...");

    // Verificar si ya existe un admin
    const existeAdmin = await User.findOne({ username: "admin" });
    if (existeAdmin) {
      console.log('⚠️ El usuario "admin" ya existe en la base de datos.');
      process.exit(0);
    }

    // Encriptar la contraseña "admin123"
    const passwordEncriptada = await bcrypt.hash("admin123", 10);

    const nuevoUsuario = new User({
      username: "admin",
      password: passwordEncriptada,
    });

    await nuevoUsuario.save();
    console.log("====================================");
    console.log("🎉 ¡PRIMER USUARIO CREADO CON ÉXITO!");
    console.log("👉 Usuario: admin");
    console.log("👉 Contraseña: admin123");
    console.log("====================================");

    process.exit(0);
  } catch (error) {
    console.error("🔴 Error al crear el usuario:", error);
    process.exit(1);
  }
}

crearPrimerUsuario();
