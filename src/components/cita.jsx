import '../App.css';


function Cita({ listaCitas, setListaCitas }) {
    console.log("listado", listaCitas)

    const borrarCita = (i) => {
        console.log('i:', i)
        const citaABorrar = [...listaCitas];
        citaABorrar.splice(i, 1)
        setListaCitas(citaABorrar)
    }

    return (
        <div className='scroll'> {listaCitas.map((cita, i) =>
            <div className="one-half column" key={i}>
                <><div className="cita">
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
                    <button className="button elimnar u-full-width" onClick={() => {borrarCita(i)}}>Eliminar ×</button>
                </div></>
            </div>
        )}</div>
    );
}

export default Cita;