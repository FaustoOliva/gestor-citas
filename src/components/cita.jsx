import '../App.css';


function cita({ listaCitas, setListaCitas, ...props }) {
    console.log("listado", listaCitas)

    const borrarCita = (i) => {
        console.log('i:', i)
        const citaABorrar = [...listaCitas];
        citaABorrar.splice(i, 1)
        setListaCitas(citaABorrar)
    }

    return (
        <div class="one-half column">
            <><div class="cita">
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
                <button class="button elimnar u-full-width" onClick={borrarCita}>Eliminar ×</button>
            </div></>

        </div>
    );
}

export default cita;