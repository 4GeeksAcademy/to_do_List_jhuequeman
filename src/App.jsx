import { useEffect, useState } from "react";
import "./App.css";
import { RiChatDeleteLine } from "react-icons/ri";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // nuevo estado para mostrar "Cargando..."

  const tareasdeFetch = () => {
    setLoading(true);
    fetch("https://playground.4geeks.com/todo/users/jhuequeman", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          // si no existe el usuario, lo crea y reintenta
          return crearUsuario().then(() => tareasdeFetch());
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data.todos || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error al obtener tareas:", error);
        setLoading(false);
      });
  };

  const crearUsuario = () => {
    return fetch("https://playground.4geeks.com/todo/users/jhuequeman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "jhuequeman" }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Usuario creado:", data))
      .catch((error) => console.error("Error al crear usuario:", error));
  };

  const agregarTarea = (label) => {
    fetch("https://playground.4geeks.com/todo/todos/jhuequeman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, is_done: false }),
    })
      .then((res) => res.json())
      .then(() => {
        // Espera un poco y luego recarga las tareas
        setTimeout(() => tareasdeFetch(), 500);
      })
      .catch((error) => console.error("Error al agregar tarea:", error));
  };

  const eliminarTarea = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar la tarea");
        // Espera un poco y luego recarga las tareas
        setTimeout(() => tareasdeFetch(), 500);
      })
      .catch((err) => console.log("Error al eliminar tarea:", err));
  };

  useEffect(() => {
    tareasdeFetch(); // primera carga

    // 🔁 actualiza cada 5 segundos automáticamente
    const intervalId = setInterval(() => {
      tareasdeFetch();
    }, 5000);

    // limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => setInputValue(e.target.value);

  const handleAddTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      agregarTarea(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="container">
      <h1>Todos</h1>

      <input
        type="text"
        onChange={handleChange}
        onKeyDown={handleAddTask}
        value={inputValue}
        placeholder="Ingresa tarea"
      />

      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas todavía 😴</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              {t.label}
              <RiChatDeleteLine
                onClick={() => eliminarTarea(t.id)}
                className="btn-delete"
              />
            </li>
          ))}
        </ul>
      )}

      <div>Tareas: {tasks.length}</div>
    </div>
  );
}

export default App;
