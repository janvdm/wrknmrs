import { useState, useRef } from 'react'
import { Container, Card, Button, Form, InputGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const [employees, setEmployees] = useState([])
  const touchStart = useRef(null)
  const touchEnd = useRef(null)
  const [swipingId, setSwipingId] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const addEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name: 'New Employee',
      salary: 0,
      gender: 'male'
    }
    setEmployees([...employees, newEmployee])
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

  const toggleGender = (id) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, gender: emp.gender === 'male' ? 'female' : 'male' } : emp
    ))
  }

  const handleTouchStart = (e, id) => {
    touchStart.current = e.targetTouches[0].clientX
    setSwipingId(id)
    setSwipeOffset(0)
  }

  const handleTouchMove = (e, id) => {
    if (swipingId !== id) return

    touchEnd.current = e.targetTouches[0].clientX
    const diff = touchStart.current - touchEnd.current

    // Limit the swipe offset to 100px
    const newOffset = Math.min(Math.max(diff, 0), 100)
    setSwipeOffset(newOffset)
  }

  const handleTouchEnd = (id) => {
    if (swipingId !== id) return

    if (swipeOffset > 50) {
      removeEmployee(id)
    } else {
      setSwipeOffset(0)
    }
    setSwipingId(null)
  }

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

  const salaryRefs = useRef({})

  const handleSalaryFocus = (id) => {
    const input = salaryRefs.current[id]
    input.select()
  }

  return (
    <Container className="py-4">
      <Button
        variant="primary"
        className="mb-4"
        onClick={addEmployee}
      >
        <i className="fas fa-plus"></i>
      </Button>

      <div className="grid-container">
        {employees.map(employee => (
          <Card
            key={employee.id}
            onTouchStart={(e) => handleTouchStart(e, employee.id)}
            onTouchMove={(e) => handleTouchMove(e, employee.id)}
            onTouchEnd={() => handleTouchEnd(employee.id)}
            className={`employee-card ${swipingId === employee.id ? 'swiping' : ''}`}
            style={{
              transform: `translateX(${swipingId === employee.id ? -swipeOffset : 0}px)`,
              transition: swipingId === employee.id ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <Button
              variant="danger"
              className="delete-button p-0 rounded-circle text-white"
              onClick={() => removeEmployee(employee.id)}
            >
              <i className="fas fa-times text-white"></i>
            </Button>
            <Card.Body>
              <Form>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={employee.name}
                    onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                    placeholder="Name"
                    style={{ width: '45%' }}
                    onFocus={() => handleFocus(employee.id)}
                    onBlur={() => handleBlur(employee.id)}
                  />
                  <InputGroup style={{ width: '45%' }}>
                    <InputGroup.Text>€</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={employee.salary}
                      onChange={(e) => updateEmployee(employee.id, 'salary', e.target.value)}
                      placeholder="Salary"
                      ref={(el) => (salaryRefs.current[employee.id] = el)}
                      onFocus={() => handleSalaryFocus(employee.id)}
                    />
                  </InputGroup>
                  <Button
                    variant={employee.gender === 'male' ? 'primary' : 'danger'}
                    onClick={() => toggleGender(employee.id)}
                    style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className={`fas fa-${employee.gender === 'male' ? 'mars' : 'venus'}`}></i>
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  )
}

export default App
