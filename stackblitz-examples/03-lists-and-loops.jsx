// ============================================
// LISTS & LOOPING IN REACT
// ============================================

import { useState } from 'react';

// Example 1: Basic Array Mapping
function BasicListExample() {
  const fruits = ['Apple', 'Banana', 'Orange', 'Mango'];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}

// Example 2: With Unique IDs (Best Practice)
function BestPracticeListExample() {
  const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.age} years old
        </li>
      ))}
    </ul>
  );
}

// Example 3: Rendering Cards
function CardListExample() {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Tablet', price: 499 },
  ];

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            width: '150px',
          }}
        >
          <h4>{product.name}</h4>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

// Example 4: Nested Lists
function NestedListExample() {
  const categories = [
    {
      id: 1,
      name: 'Fruits',
      items: ['Apple', 'Banana', 'Orange'],
    },
    {
      id: 2,
      name: 'Vegetables',
      items: ['Carrot', 'Broccoli', 'Spinach'],
    },
  ];

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: '20px' }}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item, index) => (
              <li key={`${category.id}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Example 5: Dynamic List (Add/Remove)
function DynamicListExample() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  const removeItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add new item"
        />
        <button onClick={addItem}>Add</button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}{' '}
            <button onClick={() => removeItem(index)} style={{ marginLeft: '10px' }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 6: Filtering Lists
function FilteredListExample() {
  const [filter, setFilter] = useState('');
  const allItems = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

  const filteredItems = allItems.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search fruits..."
        style={{ marginBottom: '10px' }}
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {filteredItems.length === 0 && <p>No results found.</p>}
    </div>
  );
}

// Example 7: Sorting Lists
function SortedListExample() {
  const [sortOrder, setSortOrder] = useState('asc');
  const [people] = useState([
    { id: 1, name: 'Charlie', age: 35 },
    { id: 2, name: 'Alice', age: 25 },
    { id: 3, name: 'Bob', age: 30 },
  ]);

  const sortedPeople = [...people].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.age - b.age;
    }
    return b.age - a.age;
  });

  return (
    <div>
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sort by Age ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <ul>
        {sortedPeople.map((person) => (
          <li key={person.id}>
            {person.name} - {person.age} years
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 8: Todo List with Toggle
function TodoListExample() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false },
  ]);

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => toggleTodo(todo.id)}
          style={{
            padding: '10px',
            marginBottom: '5px',
            background: todo.completed ? '#d4edda' : '#f8f9fa',
            textDecoration: todo.completed ? 'line-through' : 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          {todo.completed ? '✅' : '⬜'} {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Example 9: Pagination
function PaginatedListExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allItems = Array.from({ length: 23 }, (_, i) => `Item ${i + 1}`);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  return (
    <div>
      <ul>
        {currentItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Example 10: Table with Actions
function TableExample() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' },
  ]);

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px' }}>{user.name}</td>
            <td style={{ padding: '10px' }}>{user.email}</td>
            <td style={{ padding: '10px' }}>{user.role}</td>
            <td style={{ padding: '10px' }}>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// MAIN APP - Copy this entire file to Stackblitz
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Lists & Looping Examples</h1>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>1. Basic Array Mapping</h3>
        <BasicListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>2. With Unique IDs (Best Practice)</h3>
        <BestPracticeListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>3. Rendering Cards</h3>
        <CardListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>4. Nested Lists</h3>
        <NestedListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>5. Dynamic List (Add/Remove)</h3>
        <DynamicListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>6. Filtering Lists</h3>
        <FilteredListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>7. Sorting Lists</h3>
        <SortedListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>8. Todo List with Toggle</h3>
        <TodoListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>9. Pagination</h3>
        <PaginatedListExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>10. Table with Actions</h3>
        <TableExample />
      </section>
    </div>
  );
}
