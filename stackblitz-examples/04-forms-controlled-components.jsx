// ============================================
// FORMS & CONTROLLED COMPONENTS IN REACT
// ============================================

import { useState } from 'react';

// Example 1: Basic Controlled Input
function BasicInputExample() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}

// Example 2: Multiple Inputs
function MultipleInputsExample() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>
        <strong>Name:</strong> {formData.firstName} {formData.lastName}
        <br />
        <strong>Email:</strong> {formData.email}
      </div>
    </div>
  );
}

// Example 3: Textarea
function TextareaExample() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
        rows="4"
        style={{ width: '100%' }}
      />
      <p>Character count: {message.length}</p>
    </div>
  );
}

// Example 4: Select Dropdown
function SelectExample() {
  const [country, setCountry] = useState('');

  return (
    <div>
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="">Select a country</option>
        <option value="usa">United States</option>
        <option value="canada">Canada</option>
        <option value="uk">United Kingdom</option>
        <option value="germany">Germany</option>
      </select>
      <p>Selected: {country || 'None'}</p>
    </div>
  );
}

// Example 5: Checkbox
function CheckboxExample() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        {' '}I agree to the terms and conditions
      </label>
      <p>Status: {isChecked ? '✅ Agreed' : '❌ Not agreed'}</p>
    </div>
  );
}

// Example 6: Multiple Checkboxes
function MultipleCheckboxesExample() {
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const hobbies = ['Reading', 'Gaming', 'Cooking', 'Traveling'];

  const handleCheckboxChange = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  return (
    <div>
      <h4>Select your hobbies:</h4>
      {hobbies.map((hobby) => (
        <label key={hobby} style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={selectedHobbies.includes(hobby)}
            onChange={() => handleCheckboxChange(hobby)}
          />
          {' '}{hobby}
        </label>
      ))}
      <p>Selected: {selectedHobbies.join(', ') || 'None'}</p>
    </div>
  );
}

// Example 7: Radio Buttons
function RadioButtonExample() {
  const [selectedGender, setSelectedGender] = useState('');

  return (
    <div>
      <h4>Select your gender:</h4>
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={selectedGender === 'male'}
          onChange={(e) => setSelectedGender(e.target.value)}
        />
        {' '}Male
      </label>
      <label style={{ marginLeft: '10px' }}>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={selectedGender === 'female'}
          onChange={(e) => setSelectedGender(e.target.value)}
        />
        {' '}Female
      </label>
      <label style={{ marginLeft: '10px' }}>
        <input
          type="radio"
          name="gender"
          value="other"
          checked={selectedGender === 'other'}
          onChange={(e) => setSelectedGender(e.target.value)}
        />
        {' '}Other
      </label>
      <p>Selected: {selectedGender || 'None'}</p>
    </div>
  );
}

// Example 8: Form Submission
function FormSubmissionExample() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          style={{ marginTop: '10px' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>
          Submit
        </button>
      </form>
      {submitted && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          ✅ Form submitted successfully!
        </div>
      )}
    </div>
  );
}

// Example 9: Form Validation
function FormValidationExample() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email');
    } else {
      setError('');
      alert('Email is valid!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        placeholder="Enter email"
      />
      <button type="submit" style={{ marginLeft: '10px' }}>
        Validate
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// Example 10: Complete Registration Form
function RegistrationFormExample() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.age && formData.age < 18) {
      newErrors.age = 'Must be 18 or older';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept terms';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log('Registration data:', formData);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '20px', background: '#d4edda', borderRadius: '8px' }}>
        <h3>✅ Registration Successful!</h3>
        <p>Welcome, {formData.username}!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          style={{ width: '100%' }}
        />
        {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={{ width: '100%' }}
        />
        {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          style={{ width: '100%' }}
        />
        {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          style={{ width: '100%' }}
        />
        {errors.confirmPassword && <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          style={{ width: '100%' }}
        />
        {errors.age && <span style={{ color: 'red', fontSize: '12px' }}>{errors.age}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={handleChange}
          />
          {' '}Male
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={handleChange}
          />
          {' '}Female
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          {' '}I accept the terms and conditions
        </label>
        {errors.termsAccepted && <div style={{ color: 'red', fontSize: '12px' }}>{errors.termsAccepted}</div>}
      </div>

      <button type="submit" style={{ width: '100%', padding: '10px' }}>
        Register
      </button>
    </form>
  );
}

// MAIN APP - Copy this entire file to Stackblitz
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Forms & Controlled Components Examples</h1>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>1. Basic Controlled Input</h3>
        <BasicInputExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>2. Multiple Inputs</h3>
        <MultipleInputsExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>3. Textarea</h3>
        <TextareaExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>4. Select Dropdown</h3>
        <SelectExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>5. Checkbox</h3>
        <CheckboxExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>6. Multiple Checkboxes</h3>
        <MultipleCheckboxesExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>7. Radio Buttons</h3>
        <RadioButtonExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>8. Form Submission</h3>
        <FormSubmissionExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>9. Form Validation</h3>
        <FormValidationExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>10. Complete Registration Form</h3>
        <RegistrationFormExample />
      </section>
    </div>
  );
}
