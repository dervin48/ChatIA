import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario creado:", user);

      // Guardar datos en Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          name,
          username,
          email,
          birthDate,
          createdAt: new Date(),
        });
        console.log("Datos guardados en Firestore correctamente.");
      } catch (firestoreError) {
        console.error("Error al guardar en Firestore:", firestoreError);
        setError("Error al guardar los datos del usuario.");
        return;
      }

      setSuccess("Usuario registrado exitosamente! Redirigiendo...");
      
    } catch (error) {
      console.error("Error en Firebase Auth:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado. Intenta con otro.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña es muy débil. Usa al menos 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo ingresado no es válido.");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  // Verifica cuando success cambia y redirige
  useEffect(() => {
    if (success) {
      console.log("Mostrando mensaje de éxito:", success);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [success, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="mb-4 text-center">Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="birthDate" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
