import { useState, useRef } from 'react'
import './App.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const [employees, setEmployees] = useState([])
  const touchStart = useRef(null)
  const touchEnd = useRef(null)
  const [swipingId, setSwipingId] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const nameRefs = useRef({})

  const generateAges = () => {
    const ages = []
    // Generate ages from 18 to 67 (typical working age)
    for (let age = 18; age <= 67; age++) {
      ages.push(age.toString())
    }
    return ages
  }

  const generateSalaryRanges = () => {
    const ranges = []
    ranges.push({ value: '< 5.000', display: '< 5k' })
    for (let i = 5000; i <= 200000; i += 5000) {
      ranges.push({
        value: new Intl.NumberFormat('de-DE').format(i),
        display: `${i/1000}k`
      })
    }
    ranges.push({ value: '> 200.000', display: '> 200k' })
    return ranges
  }

  const addEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name: 'Voornaam',
      age: '35', // Default to 35 years old
      salary: '35.000',
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

  const removeEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id))
    setSwipingId(null)
    setSwipeOffset(0)
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
    if (employee.name === 'Voornaam') {
      updateEmployee(id, 'name', '')
    }
  }

  const handleBlur = (id) => {
    const employee = employees.find(emp => emp.id === id)
    if (employee.name === '') {
      updateEmployee(id, 'name', 'Voornaam')
    }
  }

  const salaryRanges = generateSalaryRanges()
  const ages = generateAges()

  return (
    <div className="container py-2 px-1 p-lg-3">
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
            className={`card employee-card border-0 bg-light ${swipingId === employee.id ? 'swiping' : ''}`}
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
            <div className="card-body p-2">
              <div className="d-flex gap-2">
                <div className="btn-group cursor-pointer " role="group" aria-label="Gender selection">
                  <input
                    type="radio"
                    className="btn-check"
                    name={`gender-${employee.id}`}
                    id={`male-${employee.id}`}
                    checked={employee.gender === 'male'}
                    onChange={() => updateEmployee(employee.id, 'gender', 'male')}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary fa-sm cursor-pointer"
                    htmlFor={`male-${employee.id}`}
                    style={{ width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fas fa-mars cursor-pointer"></i>
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name={`gender-${employee.id}`}
                    id={`female-${employee.id}`}
                    checked={employee.gender === 'female'}
                    onChange={() => updateEmployee(employee.id, 'gender', 'female')}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-pink fa-sm cursor-pointer"
                    htmlFor={`female-${employee.id}`}
                    style={{ width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fas fa-venus cursor-pointer"></i>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={employee.name}
                  onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                  placeholder="Voornaam"
                  style={{ width: 'calc(35% - 0.5rem)' }}
                  onFocus={() => handleFocus(employee.id)}
                  onBlur={() => handleBlur(employee.id)}
                  ref={(el) => (nameRefs.current[employee.id] = el)}
                />
                <select
                  className="form-select"
                  value={employee.age}
                  onChange={(e) => updateEmployee(employee.id, 'age', e.target.value)}
                  style={{ width: 'calc(30% - 0.5rem)' }}
                >
                  {ages.map(age => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select"
                  value={employee.salary}
                  onChange={(e) => updateEmployee(employee.id, 'salary', e.target.value)}
                  style={{ width: 'calc(30% - 0.5rem)' }}
                >
                  {salaryRanges.map((range, index) => (
                    <option key={index} value={range.value}>
                      {range.display}
                    </option>
                  ))}
                </select>
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
