import { useState, useRef } from 'react'
import './App.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const [employees, setEmployees] = useState([])
  const touchStart = useRef(null)
  const touchEnd = useRef(null)
  const [swipingId, setSwipingId] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const salaryRefs = useRef({})
  const nameRefs = useRef({})

  const addEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name: 'New Employee',
      salary: '0',
      gender: 'male'
    }
    setEmployees([...employees, newEmployee])
    setTimeout(() => {
      nameRefs.current[newEmployee.id]?.focus()
    }, 0)
  }

  const updateEmployee = (id, field, value) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, [field]: value } : emp
    ))
  }

  const handleSalaryChange = (id, value) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 6)
    updateEmployee(id, 'salary', digitsOnly)
  }

  const removeEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id))
    setSwipingId(null)
    setSwipeOffset(0)
  }

  const toggleGender = (id) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, gender: emp.gender === 'male' ? 'female' : 'male' } : emp
    ))
  }

  const handleTouchStart = (e, id) => {
    touchStart.current = e.targetTouches[0].clientX;
    setSwipingId(id);
    setSwipeOffset(0);
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchMove = (e, id) => {
    if (swipingId !== id) return;

    touchEnd.current = e.targetTouches[0].clientX;
    const diff = touchStart.current - touchEnd.current;

    // Limit the swipe offset to 50% of the card width
    const cardWidth = e.currentTarget.offsetWidth;
    const newOffset = Math.min(Math.max(diff, 0), cardWidth * 0.5);
    setSwipeOffset(newOffset);
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchEnd = (id) => {
    if (swipingId !== id) return;

    const cardWidth = document.querySelector(`[data-employee-id="${id}"]`).offsetWidth;
    if (swipeOffset > cardWidth * 0.25) {
      // Animate to full width and remove immediately
      setSwipeOffset(cardWidth);
      removeEmployee(id);
    } else {
      // Animate back to start
      setSwipeOffset(0);
    }
    setSwipingId(null);
  };

  const handleFocus = (id) => {
    const employee = employees.find(emp => emp.id === id)
    if (employee.name === 'New Employee') {
      updateEmployee(id, 'name', '')
    }
  }

  const handleBlur = (id) => {
    const employee = employees.find(emp => emp.id === id)
    if (employee.name === '') {
      updateEmployee(id, 'name', 'New Employee')
    }
  }

  const handleSalaryFocus = (id) => {
    const employee = employees.find(emp => emp.id === id);
    const input = salaryRefs.current[id];
    // Remove all non-digit characters when focusing
    const numericValue = employee.salary.replace(/[^0-9]/g, '');
    updateEmployee(id, 'salary', numericValue);
    setTimeout(() => {
      input.select();
    }, 0);
  };

  const handleSalaryBlur = (e, id) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      const formattedValue = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
      updateEmployee(id, 'salary', formattedValue);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-none d-xl-flex justify-content-center mb-4">
        <button
          className="btn btn-primary"
          onClick={addEmployee}
        >
          <i className="fas fa-plus me-2"></i>
          Add Employee
        </button>
      </div>

      <div className="grid-container">
        {employees.map(employee => (
          <div
            key={employee.id}
            data-employee-id={employee.id}
            onTouchStart={(e) => handleTouchStart(e, employee.id)}
            onTouchMove={(e) => handleTouchMove(e, employee.id)}
            onTouchEnd={() => handleTouchEnd(employee.id)}
            className={`card employee-card ${swipingId === employee.id ? 'swiping' : ''}`}
            style={{
              transform: `translateX(${swipingId === employee.id ? -swipeOffset : 0}px)`,
              transition: 'transform 0.2s ease-out',
              opacity: swipingId === employee.id ? (1 - (swipeOffset / (document.querySelector(`[data-employee-id="${employee.id}"]`)?.offsetWidth || 1)) * 2) : 1
            }}
          >
            <button
              className="btn-delete position-absolute top-0 start-0 translate-middle btn btn-danger rounded-circle p-0 d-none d-md-flex align-items-center justify-content-center opacity-0"
              style={{ width: '24px', height: '24px' }}
              onClick={() => removeEmployee(employee.id)}
              tabIndex={-1}
            >
              <i className="fas fa-times small"></i>
            </button>
            <div className="card-body">
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={employee.name}
                  onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                  placeholder="Name"
                  style={{ width: 'calc(45% - 0.5rem)' }}
                  onFocus={() => handleFocus(employee.id)}
                  onBlur={() => handleBlur(employee.id)}
                  ref={(el) => (nameRefs.current[employee.id] = el)}
                />
                <div className="input-group" style={{ width: 'calc(45% - 0.5rem)' }}>
                  <span className="input-group-text">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control"
                    value={employee.salary}
                    onChange={(e) => handleSalaryChange(employee.id, e.target.value)}
                    placeholder="Salary"
                    ref={(el) => (salaryRefs.current[employee.id] = el)}
                    onFocus={() => handleSalaryFocus(employee.id)}
                    onBlur={(e) => handleSalaryBlur(e, employee.id)}
                  />
                </div>
                <button
                  className={`btn ${employee.gender === 'male' ? 'btn-primary' : 'btn-pink'}`}
                  onClick={() => toggleGender(employee.id)}
                  style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className={`fas fa-${employee.gender === 'male' ? 'mars' : 'venus'}`}></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="position-fixed bottom-0 end-0 m-4 btn btn-danger rounded-circle p-3 d-flex d-xl-none align-items-center justify-content-center shadow"
        style={{ width: '56px', height: '56px' }}
        onClick={addEmployee}
        aria-label="Add Employee"
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>
  )
}

export default App
