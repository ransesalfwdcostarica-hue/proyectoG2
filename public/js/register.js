import { postUsuarios } from "../services/fetch.js";


const nombre= document.getElementById("nombre-completo");
const cedula= document.getElementById("numero-cedula");
const correo= document.getElementById("correo-electronico");
const telefono= document.getElementById("telefono");
const distrito= document.getElementById("distrito");
const direccion=document.getElementById("direccion");
const contrasena=document.getElementById("contrasena");
const confirmarContrasena=document.getElementById("confirmar-contrasena");
const terminos=document.getElementById("terminos");

const btnRegistrar=document.getElementById("registrar-cuenta");



btnRegistrar.addEventListener("click",async function () {


    const usuario={
        nombre: nombre.value,
        cedula: cedula.value,
        correo: correo.value,
        telefono: telefono.value,
        distrito: distrito.value,
        direccion: direccion.value,
        contrasena: contrasena.value,
        confirmarContrasena: confirmarContrasena.value,
        terminos: terminos.checked
    }


    let usuarioGuardado= await postUsuarios(usuario);

    console.log(usuarioGuardado);
    
    
    usuariosData.innerHTML="";

    mostrarUsuarioPantalla()
})