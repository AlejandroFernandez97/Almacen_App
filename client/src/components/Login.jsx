import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://dn347t-5000.csb.app"; // Cambiar por URL de producción cuando se despliegue el backend

export default function Login({ setToken, setUsername }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      setToken(res.data.token);
      setUsername(res.data.username);
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow border-0 p-4">
          <h3 className="text-center mb-4 text-secondary">Iniciar Sesión</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 shadow-sm"
            >
              Ingresar al Almacén
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
