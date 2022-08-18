import '../App.css';


function cita({ listaCitas, setListaCitas }) {
    console.log("listado", listaCitas)

    const borrarCita = (i) => {
        console.log('i:', i)
        const citaABorrar = [...listaCitas];
        citaABorrar.splice(i, 1)
        setListaCitas(citaABorrar)
    }

    return (
        <div className='scroll'> {listaCitas.map((cita, i) =>
            <div class="one-half column">
                <><div class="cita">
                    <p>Mascota:
                        <span> {cita.nombreM}</span>
                    </p>
                    <p>Dueño:
                        <span> {cita.nombreD}</span>
                    </p>
                    <p>Fecha:
                        <span> {cita.fecha}</span>
                    </p>
                    <p>Hora:
                        <span> {cita.hora}</span>
                    </p>
                    <p>Sintomas:
                        <span> {cita.sintomas}</span>
                    </p>
                    <button class="button elimnar u-full-width" onClick={() => {borrarCita(i)}}>Eliminar ×</button>
                </div></>
            </div>
        )}</div>
    );
}

export default cita;