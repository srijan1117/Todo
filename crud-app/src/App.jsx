import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import DigitalClock from './DigitalClock';

function App() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/todos";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const handleAdd = () => {
    if (input.trim() === '') {
      alert('Please enter a task before adding!');
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, completed: false })
    })
      .then(res => res.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setInput('');
      });
  };

  const handleDel = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    }).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim() === '') {
      alert('Task cannot be empty!');
      return;
    }

    fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText, completed: todos.find(t => t.id === editId)?.completed || false })
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo.id === editId ? updatedTodo : todo)));
        setEditId(null);
        setEditText('');
      });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditText('');
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);

    const todoToUpdate = updatedTodos.find(todo => todo.id === id);
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoToUpdate)
    });
  };

  return (
    <>
      <div className="top-right">
        <DigitalClock/>
      </div>

      <div className="mb-3 text-center">
        <h2 className="fw-bold">To do Lists - Add tasks</h2>
        <div className="div">
          <textarea
            className="form-control flex-grow-1"
            value={input}
            placeholder="Enter a task"
            onChange={(e) => setInput(e.target.value)}
            rows="4"
          />
        </div>
      </div>
      <div className="d-flex align-items-start mb-2">
        <button className="btn btn-primary d-flex align-items-start mb-3" onClick={handleAdd}>
          Add
        </button>
      </div>
      <div>
        <ul className="list-group todo-list">
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              className={`list-group-item todo-item ${todo.completed ? "is-completed" : ""}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                className="todo-checkbox"
              />

              <span className="todo-number">{index + 1}.</span>

              <div className="todo-middle">
                {editId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="form-control todo-edit-input"
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}
              </div>

              <div className="todo-right ms-auto">
                {editId === todo.id ? (
                  <>
                    <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(todo)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDel(todo.id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>


      </div>
    </>
  );
}

export default App;
