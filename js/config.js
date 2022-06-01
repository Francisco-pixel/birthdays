import { c, d } from "https://francisco-pixel.github.io/modulos/js/data.js";
import { conexionInternet } from "https://francisco-pixel.github.io/modulos/js/conexionInternet.js";
import { tiempo } from "https://francisco-pixel.github.io/modulos/js/fecha.js";
import { crearNodo } from "https://francisco-pixel.github.io/modulos/js/crearNodo.js";
import { loaderStyle } from "https://francisco-pixel.github.io/modulos/js/loader.js";
import { padreHijo } from "https://francisco-pixel.github.io/modulos/js/padreHijo.js";
import { setText } from "https://francisco-pixel.github.io/modulos/js/setText.js";
import { btnUp, btnUpStyle } from "https://francisco-pixel.github.io/modulos/js/botonSubir.js";
import { copiarText } from "https://francisco-pixel.github.io/modulos/js/copiarText.js";
import { registrar_meta_link } from "https://francisco-pixel.github.io/modulos/js/registrar_meta_link.js";
import { registrar_service_worker } from "https://francisco-pixel.github.io/modulos/js/registrar_service_worker.js";
conexionInternet()
btnUp()
tiempo()
copiarText()
registrar_meta_link()
registrar_service_worker()
btnUpStyle({
    "element": ".btn-subir",
    "bg": "hsl(30,70%,50%)",
    "wh": "50px"
})

let intervalo = 1000,
    $form = d.querySelector(".form"),
    $inputNombre = d.querySelector("#nombre"),
    $inputDia = d.querySelector("#dia"),
    $inputMes = d.querySelector("#mes"),
    $inputTel = d.querySelector("#tel"),
    $enviar = d.querySelector(".enviar"),
    $mensajeDeError = d.createElement("p"),
    $lista = d.querySelector(".lista"),
    baseDeDatos = JSON.parse(localStorage.getItem("birthday")),
    birthday = [],
    campos = {
        "nombre": false,
        "dia": false,
        "mes": false,
        "tel": false
    },
    exp = {
        "nombre": /^[a-z\sáéíóú]+$/i,
        "dia": /^[0-9]{1,2}$/,
        "mes": /^[0-9]{1,2}$/,
        "tel": /^[0-9]+$/
    };
if (Notification !== "granted") Notification.requestPermission();
let timer = () => {
    let date = new Date(),
        mesActual = date.getMonth() + 1,
        diaActual = date.getDate(),
        hora = date.getHours(),
        seg = date.getSeconds(),
        min = date.getMinutes();
    if (baseDeDatos) {
        baseDeDatos.forEach(({ nombre, dia, mes, tel }, i) => {
                if (diaActual == dia && mesActual == mes) {
                    let whatsAppApi = `https://api.whatsapp.com/send?phone=+1`,
                    ingresarTel = `${whatsAppApi}${tel}&text=`,
                    mensaje = `Muchas felicidades ${nombre}, que cumplas muchos años más, bendiciones`,
                    ingresarMensaje = `${ingresarTel}${mensaje}`;
                    resaltarFestejadosEnElDOM(i,ingresarMensaje)
                }
                if (diaActual == dia && mesActual == mes && hora==8 && min%30==0 && seg==0) {
                    let whatsAppApi = `https://api.whatsapp.com/send?phone=+1`,
                    ingresarTel = `${whatsAppApi}${tel}&text=`,
                    mensaje = `Muchas felicidades ${nombre}, que cumplas muchos años más, bendiciones`,
                    ingresarMensaje = `${ingresarTel}${mensaje}`;
                    setTimeout(() => {
                        let notificar = new Notification(`Felicita a ${nombre}`, {
                            body: `${nombre} cumpleaños hoy`
                        })
                        notificar.onclick = () => window.open(ingresarMensaje);
                    }, -intervalo)
                    //clearInterval(stopIntervalo)             
                    resaltarFestejadosEnElDOM(i,ingresarMensaje)
                }
        })
    }
}

let stopIntervalo=setInterval(timer, intervalo);

let guardarBadeDeDatos = () => localStorage.setItem("birthday", JSON.stringify(birthday));

d.addEventListener("click", e => {
    if (e.target.matches(".ingresar")) {
        d.querySelector(".cover").classList.toggle("mostrar")
    }
    if (e.target.matches(".cover")) {
        d.querySelector(".ingresar").click()
    }
    if (e.target.matches(".card")) {
        let { index } = e.target.dataset;
        eliminarCard(index)
    }
})
d.addEventListener("DOMContentLoaded", () => {
    if (baseDeDatos) {
        baseDeDatos.forEach((bd, i) => {
            birthday[i] = bd;
            guardarBadeDeDatos()
            mostrarDatosEnElDOM()
        })
    }
})
$form.addEventListener("submit", e => {
    e.preventDefault()
    if (!campos.nombre || !campos.dia || !campos.mes || !campos.tel) {
        $mensajeDeError.innerText = "Llena los campos correctamente";
        $enviar.insertAdjacentElement("afterend", $mensajeDeError)
        setTimeout(() => {
            $mensajeDeError.remove();
        }, 1000)
    } else {
        $mensajeDeError.innerText = "Datos ingresados correctamente";
        $enviar.insertAdjacentElement("afterend", $mensajeDeError)
        let template = {
            "nombre": $inputNombre.value.trim(),
            "dia": parseInt($inputDia.value.trim()),
            "mes": parseInt($inputMes.value.trim()),
            "tel": parseInt($inputTel.value.trim())
        }
        birthday.push(template);
        guardarBadeDeDatos()
        mostrarDatosEnElDOM()
        $form.reset();
        setTimeout(() => {
            $mensajeDeError.remove();
        }, 1000)
    }
})

let validarInputs = (e) => {
    let { name } = e.target,
        validacion = {
            "nombre": {
                name,
                exp: exp[name],
                input: e.target,
                "mensaje": "Solo texto sin caracteres especiales"
            },
            "dia": {
                name,
                exp: exp[name],
                input: e.target,
                "mensaje": "Solo dos números sin caracteres especiales"
            },
            "mes": {
                name,
                exp: exp[name],
                input: e.target,
                "mensaje": "Solo dos números sin caracteres especiales"
            },
            "tel": {
                name,
                exp: exp[name],
                input: e.target,
                "mensaje": "Solo números sin caracteres especiales"
            }
        };
    validarFormulario(validacion[name])
}

let validarFormulario = (validacion) => {
    if (validacion.exp.test(validacion.input.value)) {
        campos[validacion.name] = true;
        $mensajeDeError.remove()
        validacion.input.classList.add("colorVerde")
        validacion.input.classList.remove("colorRojo")
    } else {
        validacion.input.classList.remove("colorVerde")
        validacion.input.classList.add("colorRojo")
        $mensajeDeError.innerHTML = validacion.mensaje;
        validacion.input.insertAdjacentElement("afterend", $mensajeDeError);
        campos[validacion.name] = false;
        //validacion.input.value=validacion.input.value.replace(/^[-0-9a-z\/*@\.]+$/g,"");
    }
}
d.addEventListener("keyup", e => {
    if (e.target.matches(".input")) {
        validarInputs(e)
    }
})

let mostrarDatosEnElDOM = () => {
    if (baseDeDatos) {
        let mostrar = "";
        birthday.forEach(({ nombre, mes, dia }, i) => {
            mostrar += `
            <div class="card" data-index="${i}">
                <p class="card__item">${nombre}</p>
                <p class="card__item">${dia}-${mes}</p>
            </div>`;
        })
        $lista.innerHTML = `${mostrar}`
    }
}
let eliminarCard = (index) => {
    if (confirm("¿Quieres eliminar este item?")) {
        birthday.splice(index, 1)
        guardarBadeDeDatos()
        mostrarDatosEnElDOM()
    }
}

let resaltarFestejadosEnElDOM = (i,link) => {
    let a=`<a href="${link}" target="_blank" class="tooltip">Cumpleaño</a>`;
    d.querySelectorAll(".card")[i].insertAdjacentHTML("beforeend",a)
    d.querySelectorAll(".card")[i].style.border = "1px solid #2583c5";
   let tooltipLength= d.querySelectorAll(".tooltip").length;
   if(tooltipLength>1){
    d.querySelectorAll(".tooltip")[1].remove();
   }
}
