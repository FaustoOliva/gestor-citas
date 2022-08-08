import '../App.css';


function cita({ cita }) {
    console.log(cita)
    return (
        <div class="one-half column">
            <><h2>Administra tus citas</h2><div class="cita">
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
                    <button class="button elimnar u-full-width">Eliminar ×</button>
                </div></>
        </div>
    );
}

export default cita;