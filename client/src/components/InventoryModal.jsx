import React, { useState, useEffect } from "react";
import axios from "axios";

// 💡 CORRECCIÓN: Se cambió "http" por "https" para cumplir con las políticas de seguridad
const API_URL = "https://dn347t-5000.csb.app/api/products";

export default function InventoryModal({
  product,
  closeModal,
  refresh,
  config,
}) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 0,
    price: 0,
    description: "",
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await axios.put(`${API_URL}/${product._id}`, form, config);
      } else {
        await axios.post(API_URL, form, config);
      }
      refresh();
      closeModal();
    } catch (err) {
      console.error("Error al guardar el producto:", err);
    }
  };

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50 align-items-center"
      style={{ display: "flex" }}
    >
      <div className="modal-dialog modal-md m-auto w-100">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {product ? "Modificar Datos" : "Registrar Nuevo Bien"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nombre del Bien</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">SKU Código</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                  disabled={!!product}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>
            </div>
            {!product && (
              <div className="mb-3">
                <label className="form-label">Cantidad Inicial</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Descripción / Ubicación</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              ></textarea>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
