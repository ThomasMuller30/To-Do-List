import '../List/List.css'
import { useState, useEffect } from 'react';

function List() {

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
        <>
            <div className='add-to-do'>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nouvelle tâche" />
                <button onClick={addTodo}><i class="fa-solid fa-square-plus"></i></button>
            </div>

            <div className='to-do-list'>
                <ul className='list-to-do'>
                    {todos.map(todo => (
                        <li key={todo.id} style={{ marginBottom: '1rem' }}>
                            {editId === todo.id ? (
                                <>
                                    <input
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                    />
                                    <button onClick={() => saveEdit(todo.id)}><i class="fa-solid fa-square-check"></i></button>
                                    <button onClick={() => setEditId(null)}><i class="fa-solid fa-square-xmark"></i></button>
                                </>
                            ) : (
                                <>
                                    <span style={{ marginLeft: 8 }}>
                                        {todo.title}
                                    </span>
                                    <button style={{ marginLeft: 8 }} onClick={() => startEdit(todo)}><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button style={{ marginLeft: 8 }} onClick={() => deleteTodo(todo.id)}><i class="fa-solid fa-trash"></i></button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default List;