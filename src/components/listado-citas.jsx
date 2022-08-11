import React from 'react';
import Cita from './cita.jsx'

export default function ListadoCitas({ listaCitas, setListaCitas }) {
    return (
        listaCitas.map((cita, i) =>
            <Cita
                listaCitas={listaCitas}
                setListaCitas={setListaCitas}
                key={i}
            />)
    )
};