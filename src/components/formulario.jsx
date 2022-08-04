import '../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import React, {useState, useEffect} from 'react';


function formulario() {
    const [cita, setCita] = useState({
        nombreM: "",
        nombreD: "",
        fecha: "",
        hora: "",
        sintomas: ""
    })

    const saveInformation = (event) => {
        setCita({
            ...cita,
            [event.target.name] : event.target.value
        })
        console.log(cita)
    }


    const sendInformation = (event) => {
        event.preventDefault()
    }
    
    
    
    return (
        <div class="one-half column">
            <h2>Crear mi Cita</h2>
            <Form onSubmit={sendInformation}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre Mascota</Form.Label>
                    <Form.Control type="text" placeholder="Nombre Mascota" onChange={saveInformation}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre dueño</Form.Label>
                    <Form.Control type="text" placeholder="Nombre dueño de la Mascota" onChange={saveInformation}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date" name="fecha" class="u-full-width" value="" onChange={saveInformation}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control type="time" name="hora" class="u-full-width" value="" onChange={saveInformation}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sintomas</Form.Label>
                    <Form.Control as="textarea" name="sintomas" class="u-full-width" onChange={saveInformation}/>
                </Form.Group>

                <Button variant="primary" type="submit" >
                    Agregar cita
                </Button>
            </Form>
        </div>
    );
}
export default formulario;