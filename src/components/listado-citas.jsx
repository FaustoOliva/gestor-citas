import React from 'react';


const listaCitas=[];

export function listado(props) {
    const cita={
        mascota: props.mascota,
        dueno: props.dueno,
        fecha: props.fecha,
        hora: props.hora,
        sintomas: props.sintomas
    }
    listaCitas.push(cita);
    console.log(cita)
};
