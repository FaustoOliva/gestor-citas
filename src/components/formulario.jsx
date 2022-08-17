import '../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import React, { useState } from 'react';


function Formulario({ setListaCitas }) {
    const [nombreM, setNombreM] = useState('');
    const [nombreD, setNombreD] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [sintomas, setSintomas] = useState('');

    const sendInformation = (event) => {
        event.preventDefault()
        console.log("datos enviados")
        setListaCitas(prev => [...prev, {
            nombreM,
            nombreD,
            fecha,
            hora,
            sintomas
        }])
        setNombreM("");
        setNombreD("");
        setFecha("");
        setHora("");
        setSintomas("");
    }

    return (
        <div class="one-half column">
            <h2>Crear mi Cita</h2>
            <Form onSubmit={sendInformation}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre Mascota</Form.Label>
                    <Form.Control type="text" placeholder="Nombre Mascota" name="nombreM" onChange={e => setNombreM(e.target.value)} value={nombreM} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre dueño</Form.Label>
                    <Form.Control type="text" placeholder="Nombre dueño de la Mascota" name="nombreD" onChange={e => setNombreD(e.target.value)} value={nombreD} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date" name="fecha" class="u-full-width" onChange={e => setFecha(e.target.value)} value={fecha} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control type="time" name="hora" class="u-full-width" onChange={e => setHora(e.target.value)} value={hora} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sintomas</Form.Label>
                    <Form.Control as="textarea" name="sintomas" class="u-full-width" onChange={e => setSintomas(e.target.value)} value={sintomas} required />
                </Form.Group>

                <Button variant="primary" type="submit" >
                    Agregar cita
                </Button>
            </Form>
        </div>
    );
}
export default Formulario;