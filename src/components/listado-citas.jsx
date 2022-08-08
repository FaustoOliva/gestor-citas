import React from 'react';
import Cita from './cita.jsx'

export default function ListadoCitas({ citas, setCitas }) {
    return (
    {citas.map((cita, i) => <Cita
    {...cita}
    delete={() => {
    const copy = [...citas]
    copy.splice(i, 1)
    console.log(copy)
    setCitas(copy)
    }}
    key={i}
    />)}
   
    )
}