import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from './firebaseConfig'; // Asegúrate de que está configurado correctamente
import { signOut } from "firebase/auth";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [history, setHistory] = useState([]);  // Para almacenar el historial de preguntas
  const navigate = useNavigate();

  // Función para enviar el mensaje y recibir respuesta de AIML
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = newMessage;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: newMessage }
      ]);
      setNewMessage("");  // Limpiar el input del mensaje

      // Guardar el mensaje en el historial
      setHistory((prevHistory) => [
        ...prevHistory,
        { message: newMessage }
      ]);

      // Hacer la petición a la API AIML (esto depende de cómo hayas configurado tu servidor AIML)
      try {
        const response = await fetch("https://chat-ia-brown.vercel.app/api/chat", {
          // const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });
        const data = await response.json();
        const aiMessage = data.reply;  // Suponiendo que la respuesta se encuentra en "reply"
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: aiMessage }
        ]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: "Sorry, I didn't understand that." }
        ]);
      }
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    signOut(auth) // Cierra sesión
      .then(() => {
        navigate("/"); // Redirige a la página de inicio después de cerrar sesión
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        {/* Panel de historial */}
        <div className="col-md-3">
          <div className="bg-light p-3" style={{ height: "400px", overflowY: "scroll" }}>
            <h4>Historial de Preguntas</h4>
            <ul className="list-unstyled">
              {history.map((item, index) => (
                <li key={index} className="mb-2">
                  <div className="bg-info text-white p-2 rounded-3">
                    {item.message}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel de chat */}
        <div className="col-md-8">
          <div className="card p-4">
            <h2 className="mb-4 text-center">Chat with AI</h2>

            {/* Botón de logout */}
            <button
              className="btn btn-danger mb-3"
              onClick={handleLogout}
            >
              Logout
            </button>

            <div className="chat-box" style={{ height: "400px", overflowY: "scroll" }}>
              <ul className="list-unstyled">
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={message.role === "user" ? "text-end" : "text-start"}
                  >
                    <div
                      className={`message p-2 mb-2 rounded-3 ${message.role === "user" ? "bg-primary text-white" : "bg-light"}`}
                    >
                      {message.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulario para enviar un mensaje */}
            <form onSubmit={handleSendMessage} className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Que necesitas que te apoye..."
                  required
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
