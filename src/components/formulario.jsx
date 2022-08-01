import '../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

function formulario() {
    return (
        <div class="one-half column">
            <h2>Crear mi Cita</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre Mascota</Form.Label>
                    <Form.Control type="email" placeholder="Nombre Mascota" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nombre dueño</Form.Label>
                    <Form.Control type="email" placeholder="Nombre dueño de la Mascota" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date" name="fecha" class="u-full-width" value="" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control type="time" name="hora" class="u-full-width" value=""/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sintomas</Form.Label>
                    <Form.Control as="textarea" name="sintomas" class="u-full-width" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Agregar cita
                </Button>
            </Form>
        </div>
    );
}
export default formulario;