import '../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function Formulario({ setListaCitas, usuario }) {
    const [nombreM, setNombreM] = useState('');
    const [nombreD, setNombreD] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [sintomas, setSintomas] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const limpiarCampos = () => {
        setNombreM('');
        setNombreD('');
        setFecha('');
        setHora('');
        setSintomas('');
    };

    const esFechaValida = (fechaStr) => {
        const hoy = new Date().toISOString().split('T')[0];
        return fechaStr >= hoy;
    };

    const sendInformation = (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);

        if (!nombreM || !nombreD || !fecha || !hora || !sintomas) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (!esFechaValida(fecha)) {
            setError('Ingrese una fecha posterior al día de hoy.');
            return;
        }

        const nuevaCita = {
            idCita: crypto.randomUUID(),   // ID único de la cita
            idUsuario: usuario,            // ID del paciente actual
            nombreM,
            nombreD,
            fecha,
            hora,
            sintomas
        };

        setListaCitas(prev => [...prev, nuevaCita]);
        setSuccess(true);
        limpiarCampos();

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    return (
        <div className="one-half column">
            <h2>Crear mi Cita</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Cita agregada correctamente.</Alert>}
            <Form onSubmit={sendInformation}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre Mascota</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nombre Mascota"
                        value={nombreM}
                        onChange={(e) => setNombreM(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nombre Dueño</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nombre del dueño"
                        value={nombreD}
                        onChange={(e) => setNombreD(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Síntomas</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={sintomas}
                        onChange={(e) => setSintomas(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-2">
                    Agregar cita
                </Button>
            </Form>
        </div>
    );
}
export default Formulario;