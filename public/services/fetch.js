async function postUsuarios(usuario) {

    try {

        const respuesta = await fetch("http://localhost:3001/usuarios",{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify(usuario)

        });

    const datosUsuarios = await respuesta.json();

    return datosUsuarios;

} catch (error) {

    console.error("Error al obtener los usuarios", error);
}



}

export { postUsuarios }