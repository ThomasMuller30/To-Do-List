import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('http://localhost:5000/todos')
      .then(res => res.json())
      .then(setTodos);
  };

  const addTodo = () => {
    if (!title.trim()) return;

    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTitle('');
      });
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(todo => todo.id !== id)));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle })
    }).then(() => {
      setEditId(null);
      setEditTitle('');
      fetchTodos();
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Choses à faire</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Nouvelle tâche"
      />
      <button onClick={addTodo}>Ajouter</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '1rem' }}>
            {editId === todo.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Sauvegarder</button>
                <button onClick={() => setEditId(null)}>Annuler</button>
              </>
            ) : (
              <>
                <span style={{ marginLeft: 8}}>
                  {todo.title}
                </span>
                <button style={{ marginLeft: 8}} onClick={() => startEdit(todo)}>Modifier</button>
                <button style={{ marginLeft: 8}} onClick={() => deleteTodo(todo.id)}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
