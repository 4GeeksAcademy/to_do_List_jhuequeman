import { useEffect, useState } from 'react';
import './App.css';
import { RiChatDeleteLine } from "react-icons/ri";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);

  const tareasdeFetch = ()=>{
    fetch("https://playground.4geeks.com/todo/users/jhuequeman",{
      method: "GET",
      headers:{
        "Content-Type": "application/json"
      }
    })  .then((Response)=> {
        if(!Response.ok){
          return crearUsuario().then(() => tareasdeFetch());

    }
        return Response.json();
    })
        .then((data)=> setTasks(data.todos))
        .catch((error) => console.log(error));
  
  }

    const crearUsurio = ()=>{
      fetch("https://playground.4geeks.com/todo/users/jhuequeman",{
        method :"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify({name:"jhuequeman"})

      }) .then((res)=> res.json())
         .then((data) =>console.log("usuario creado",data))
         .catch((error)=> console.error("error",error))
      
    }

    const agregarTarea = (label)=>{
      fetch("https://playground.4geeks.com/todo/users/jhuequeman",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({label, is_done: "false"})
      })
      
      .then((res)=> res.json())
      .then((data)=>{
        const nuevaTarea = {id:data.id,label}
        setTasks([... tasks,nuevaTarea]);
      })
      .catch((error)=> console.error("error",error));
      

    }

      const eliminarTarea = (id, index) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar la tarea");
      const nuevasTareas = tasks.filter((_, i) => i !== index);
      setTasks(nuevasTareas);
    })
    .catch(err => console.log("Error al eliminar tarea:", err));
  };

  useEffect(()=>{
    tareasdeFetch();
  }, [])
  
  

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      agregarTarea(inputValue.trim());
      setInputValue("");
    }
  };

  const deletetodo = (index)=>{
    const tarea = tasks[index];
    if(tarea.id){
         eliminarTarea(tarea.id,index)
    }
    
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
            {t.label} <RiChatDeleteLine  onClick={()=>{deletetodo(index)}} className='btn-delete' />
          </li>
        ))}

      </ul>
      <div>Tareas: {tasks.length}</div>
    </div>
  );
}

export default App;