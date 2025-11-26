// ============================================
// COMPLETE DEMO - Task Manager App
// Combines: Events, Conditional Rendering, Lists, Forms
// ============================================

import { useState } from 'react';

export default function TaskManagerApp() {
  // State management
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React Basics', category: 'Learning', completed: false, priority: 'high' },
    { id: 2, title: 'Build a project', category: 'Development', completed: false, priority: 'medium' },
  ]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
  });
  
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, priority, title
  const [showForm, setShowForm] = useState(false);

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title,
      category: formData.category || 'General',
      priority: formData.priority,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setFormData({ title: '', category: '', priority: 'medium' });
    setShowForm(false);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Conditional Rendering & Filtering Logic
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by completion status
    if (filter === 'active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filtered = [...filtered].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (sortBy === 'title') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // Priority color helper
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#44bb44';
      default:
        return '#999';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>✅ Task Manager Pro</h1>
        <p style={{ color: '#666' }}>
          Manage your tasks efficiently with React
        </p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '15px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Tasks</div>
        </div>
        <div style={{ flex: 1, padding: '15px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{activeCount}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Active</div>
        </div>
        <div style={{ flex: 1, padding: '15px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{completedCount}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Completed</div>
        </div>
      </div>

      {/* Add Task Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {showForm ? '✖ Cancel' : '➕ Add New Task'}
        </button>
      </div>

      {/* Form - Conditional Rendering */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '20px',
            background: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>New Task</h3>
          
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title (e.g., Buy groceries)"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category (optional)"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Priority:
            </label>
            <label style={{ marginRight: '15px' }}>
              <input
                type="radio"
                name="priority"
                value="high"
                checked={formData.priority === 'high'}
                onChange={handleInputChange}
              />
              {' '}🔴 High
            </label>
            <label style={{ marginRight: '15px' }}>
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={formData.priority === 'medium'}
                onChange={handleInputChange}
              />
              {' '}🟡 Medium
            </label>
            <label>
              <input
                type="radio"
                name="priority"
                value="low"
                checked={formData.priority === 'low'}
                onChange={handleInputChange}
              />
              {' '}🟢 Low
            </label>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Add Task
          </button>
        </form>
      )}

      {/* Search & Filters */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search tasks..."
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>

          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              style={{
                padding: '8px 15px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Task List - Conditional Rendering for Empty State */}
      {filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
          <p>
            {searchTerm
              ? 'No tasks match your search'
              : filter === 'completed'
              ? 'No completed tasks yet'
              : 'No tasks yet. Add one to get started!'}
          </p>
        </div>
      ) : (
        <div>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: '15px',
                marginBottom: '10px',
                background: task.completed ? '#f0f0f0' : 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'all 0.3s',
              }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />

              {/* Task Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '16px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#999' : '#333',
                    fontWeight: task.completed ? 'normal' : 'bold',
                  }}
                >
                  {task.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {task.category && (
                    <span style={{ marginRight: '10px' }}>📁 {task.category}</span>
                  )}
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: getPriorityColor(task.priority),
                      color: 'white',
                      fontSize: '11px',
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  padding: '6px 12px',
                  background: '#ff5252',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
        <p>Built with React ⚛️ | Showcasing: Events, Conditional Rendering, Lists, Forms</p>
      </footer>
    </div>
  );
}
