import { useState } from 'react'
import { Container, Card, Button, Form, InputGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const [employees, setEmployees] = useState([])

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

  const toggleGender = (id) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, gender: emp.gender === 'male' ? 'female' : 'male' } : emp
    ))
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Employee Management</h1>

      <Button
        variant="primary"
        className="mb-4"
        onClick={addEmployee}
      >
        <i className="fas fa-plus"></i>
      </Button>

      <div className="grid-container">
        {employees.map(employee => (
          <Card key={employee.id}>
            <Card.Body>
              <Form>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={employee.name}
                    onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                    placeholder="Name"
                    style={{ width: '45%' }}
                  />
                  <InputGroup style={{ width: '45%' }}>
                    <InputGroup.Text>€</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={employee.salary}
                      onChange={(e) => updateEmployee(employee.id, 'salary', e.target.value)}
                      placeholder="Salary"
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
