import { useState } from 'react';
import './App.css';
import { RiChatDeleteLine } from "react-icons/ri";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTasks([...tasks, inputValue.trim()]);
      setInputValue("");
    }
  };

  const deletetodo = (index)=>{
    const listaActualizada = tasks.filter((FcTodoList, i) => i !== index)
    setTasks(listaActualizada);
  }

  return (
    <div className='container'>
      <h1>Todos</h1>

      <input
        type="text"
        onChange={handleChange}
        onKeyDown={handleAddTask}
        value={inputValue}
        placeholder='Ingresa tarea'
      />

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            {t} <RiChatDeleteLine  onClick={()=>{deletetodo(index)}} className='btn-delete' />
          </li>
        ))}

      </ul>
      <div>Tareas: {tasks.length}</div>
    </div>
  );
}

export default App;