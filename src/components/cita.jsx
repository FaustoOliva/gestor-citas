import '../App.css';


function Cita({ listaCitas, setListaCitas }) {
    console.log("listado", listaCitas)

    const borrarCita = (idCita) => {
        const nuevas = listaCitas.filter(c => c.idCita !== idCita);
        setListaCitas(nuevas);
    };

    return (
        <div className='scroll'> {listaCitas.map((cita, i) =>
            <div className="one-half column" key={cita.idCita}>
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
                    <button className="button elimnar u-full-width" onClick={() => { borrarCita(i) }}>Eliminar ×</button>
                </div></>
            </div>
        )}</div>
    );
}

export default Cita;