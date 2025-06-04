import React, { useState } from "react";

export default function LoginDVWA() {
  const [nivel, setNivel] = useState("low");
  const [nombre_usuario, setUsuario] = useState("");
  const [contraseña, setPassword] = useState("");
  const [respuesta, setRespuesta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta(null);

    try {
      
      const res = await fetch(`http://localhost:5000/api/login_${nivel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario: nombre_usuario, contraseña: contraseña }),
      });
      console.log("aaaaaaaaaaaaaa");
      const data = await res.json();
      setRespuesta(data);
    } catch (error) {
      setRespuesta({ error: "Error en la conexión" });
    }
  };

  return (
    <div>
      <h2>Login DVWA - Nivel {nivel.toUpperCase()}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario: 
          <input
            type="text"
            value={nombre_usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Contraseña: 
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Nivel:
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
          </select>
        </label>
        <br />
        <button type="submit">Iniciar sesión</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h3>Respuesta:</h3>
        <pre>{respuesta ? JSON.stringify(respuesta, null, 2) : "Sin respuesta aún"}</pre>
      </div>
    </div>
  );
}
