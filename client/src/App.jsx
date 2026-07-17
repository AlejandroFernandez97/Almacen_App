import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark mb-4 shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1">📦 Control Stock Pro</span>
          {token && (
            <div className="d-flex align-items-center">
              <span className="text-light me-3">
                Hola, <strong>{username}</strong>
              </span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="container">
        {!token ? (
          <Login setToken={setToken} setUsername={setUsername} />
        ) : (
          <Dashboard token={token} />
        )}
      </div>
    </div>
  );
}

export default App;
