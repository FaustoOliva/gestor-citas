import '../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import React, { useState } from 'react';


function Formulario({addCita}) {
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
            [event.target.name]: event.target.value
        })
        console.log(cita)
    }


    const sendInformation = (event) => {
        event.preventDefault()
        console.log("datos enviados")
        addCita(cita)
        setCita({nombreM: "", nombreD: "", fecha: "", hora: "", sintomas: ""})
    }



    return (
        <div class="one-half column">
            <h2>Crear mi Cita</h2>
            <Form onSubmit={sendInformation}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre Mascota</Form.Label>
                    <Form.Control type="text" placeholder="Nombre Mascota" name="nombreM" onChange={saveInformation} value={cita.nombreM} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre dueño</Form.Label>
                    <Form.Control type="text" placeholder="Nombre dueño de la Mascota" name="nombreD" onChange={saveInformation} value={cita.nombreD} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date" name="fecha" class="u-full-width" onChange={saveInformation} value={cita.fecha} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control type="time" name="hora" class="u-full-width" onChange={saveInformation} value={cita.hora} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sintomas</Form.Label>
                    <Form.Control as="textarea" name="sintomas" class="u-full-width" onChange={saveInformation} value={cita.sintomas} requireds />
                </Form.Group>

                <Button variant="primary" type="submit" >
                    Agregar cita
                </Button>
            </Form>
        </div>
    );
}
export default Formulario;