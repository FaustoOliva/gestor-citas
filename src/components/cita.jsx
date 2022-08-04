import '../App.css';


function listado(props ) {
    return (
        <div class="one-half column">
            <h2>Administra tus citas</h2>
            <div class="cita">
                <p>Mascota:
                    <span> {props.nombreM}</span>
                </p>
                <p>Dueño:
                    <span> {props.nombreD}</span>
                </p>
                <p>Fecha:
                    <span> {props.fecha}</span>
                </p>
                <p>Hora:
                    <span> {props.hora}</span>
                </p>
                <p>Sintomas:
                    <span> {props.sintomas}</span>
                </p>
                <button class="button elimnar u-full-width">Eliminar ×</button>
            </div>
        </div>
    );
}

export default listado;