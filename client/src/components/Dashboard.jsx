import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryModal from "./InventoryModal";

const API_URL = "https://dn347t-5000.csb.app/api/products";

export default function Dashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 1. Función para generar las cabeceras en tiempo real con el token más fresco posible
  const getAuthHeader = () => {
    const activeToken = token || localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${activeToken}` } };
  };

  const loadProducts = async () => {
    const activeToken = token || localStorage.getItem("token");

    // Si no hay token de ninguna fuente, detenemos la petición para evitar el Error 400
    if (!activeToken || activeToken === "undefined") return;

    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  // 2. Escuchamos activamente cuando el token cambie o se inicialice
  useEffect(() => {
    loadProducts();
  }, [token]);

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este bien?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        loadProducts();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const changeQuantity = async (product, amount) => {
    const newQty = Math.max(0, product.quantity + amount);
    try {
      await axios.put(
        `${API_URL}/${product._id}`,
        { ...product, quantity: newQty },
        getAuthHeader()
      );
      loadProducts();
    } catch (err) {
      console.error("Error al cambiar cantidad:", err);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-dark">Gestión de Bienes</h2>
        <button
          className="btn btn-success d-flex align-items-center shadow-sm"
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
        >
          ➕ Agregar Nuevo Bien
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th className="text-center">Existencias</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No hay productos registrados o cargando...
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <span className="badge bg-secondary font-monospace">
                      {p.sku}
                    </span>
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <br />
                    <small className="text-muted">{p.description}</small>
                  </td>
                  <td>${p.price.toFixed(2)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => changeQuantity(p, -1)}
                      >
                        -
                      </button>
                      <span
                        className={`fw-bold fs-5 ${
                          p.quantity < 5 ? "text-danger" : "text-success"
                        }`}
                      >
                        {p.quantity}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => changeQuantity(p, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <InventoryModal
          product={selectedProduct}
          closeModal={() => setShowModal(false)}
          refresh={loadProducts}
          config={getAuthHeader()} // Envia las cabeceras dinámicas corregidas
        />
      )}
    </div>
  );
}
