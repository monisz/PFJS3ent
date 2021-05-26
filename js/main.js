//Generación de cards habitaciones
const seccionHabitaciones = document.getElementById('habitacionesJS');

generarCards(habitaciones);

function generarCards(habitaciones) {
    seccionHabitaciones.innerHTML = '';
    habitaciones.forEach((habitacion) => {
        const div = document.createElement('div');
        div.classList.add('habitacion');
        div.innerHTML = `<div class="habitacion-tipo">
            <img class="habitacion-tipo-imagen" src="${habitacion.imagen}" alt="habitación hotel">
            <div class="habitacion-tipo-info">
                <h3 class="habitacion-tipo-info-nombre">${habitacion.nombre}</h3>
                <p class="habitacion-tipo-info-detalle">${habitacion.descripcion[0]}</p>
                <ul class="habitacion-tipo-info-items">
                    <li>${habitacion.descripcion[1]}</li>
                    <li>${habitacion.descripcion[2]}</li>
                    <li>${habitacion.descripcion[3]}</li>
                    <li>${habitacion.descripcion[4]}</li>
                </ul>
                <div class="habitacion-tipo-info-reserva">
                    <p>$ ${habitacion.precio}/noche</p>
                    <button class="btn btn-lg btn-info habitacion-tipo-info-reserva-boton" onclick="elegirFechas(${habitacion.id})">Elegir fechas</button>
                </div>
            </div>
        </div>`;
        seccionHabitaciones.appendChild(div);
    })
}

//Para saber si tiene reserva anterior y cargarla
if (reservaEnLocal) {
    reserva = reservaEnLocal;
    acumuladorReserva = JSON.parse(localStorage.getItem('totalReserva'));
}

// FUNCION PARA MOSTRAR FORMULARIO DE FECHAS
function elegirFechas(id) {
    idSeleccionado = id;
    $("#reservar").css({"margin-left":"100%"});
    window.scrollTo({
        top: 0,
        behavior: "smooth"
        });
    $("#formulario").css({"font-weight":"bold"})
                    .slideDown(2000);
    document.getElementById('agregadoAReserva').innerHTML = '';                 
}

$("#reservar").click(agregarAReserva);

//* Función para agregar noches a la reserva, con todas las llamadas a funciones asociadas */
function agregarAReserva() {
    id = idSeleccionado;
    ok = verificarIngresos();
    if (ok) {
        let entrada = document.getElementById('entrada').value;
        let salida = document.getElementById('salida').value;
        const cantidadPedida = calcularNoches(entrada, salida);
        if (cantidadPedida !== 0) {
            document.getElementById('ingresoErroneo').innerHTML = '';
            const habitacionAgregada = habitaciones.find((el) => el.id === id);
            console.log("stock habit inicial " + habitaciones[id-1].stock);
            if (habitacionAgregada.stock - cantidadPedida >= 0) {
                const subTotal = habitacionAgregada.precio * cantidadPedida;
                acumuladorReserva += subTotal;
                descontarStock(cantidadPedida, id);
                subirAReserva(habitacionAgregada.id, habitacionAgregada.nombre, habitacionAgregada.precio, cantidadPedida, entrada, salida);
                mostrarReserva(cantidadPedida, habitacionAgregada.nombre);
                guardarEnLocalStorage();
            } else {
                document.getElementById('agregadoAReserva').innerHTML = `
                    <h4 style="font-weight:bold">No hay disponibilidad suficiente. 
                    Puede reservar hasta ${habitaciones[id-1].stock} noche/s</h4>
                `;
            }
            console.log("stock " + habitaciones[id-1].stock + " acumuladorCarrito " + acumuladorReserva + " al terminar");
        }
        document.getElementById('entrada').value = '';
        document.getElementById('salida').value = '';
        document.getElementById('cantidadPersonas').value = '';
    } else {
        elegirFechas(id);
    }
}

// FUNCION PARA VERIFICAR EL INGRESO CORRECTO DE LOS DATOS
function verificarIngresos() {
    const hoy = new Date();
    hoyModificado = hoy.toISOString();
    fechaDeHoy = hoyModificado.slice(0, 10);
    let ok = false;
    if ((document.getElementById('entrada').value == "") || (document.getElementById('salida').value == "")) {
        document.getElementById('ingresoErroneo').innerHTML = `<h4
            style="color:red">Debe completar las fechas de entrada y salida</>`;
    } else if (document.getElementById('entrada').value >= document.getElementById('salida').value) {
            document.getElementById('ingresoErroneo').innerHTML = `<h4
                style="color:red">La fecha de salida no debe ser igual o anterior a la de entrada</h4>`;
        } else if (document.getElementById('entrada').value <= fechaDeHoy) {
                document.getElementById('ingresoErroneo').innerHTML = `<h4
                    style="color:red">La fecha de entrada debe ser posterior a la fecha de hoy</h4>`;
            } else if (document.getElementById('cantidadPersonas').value == "") {
                document.getElementById('ingresoErroneo').innerHTML = `<h4 
                    style="color:red">Debe completar la cantidad de personas</h4>`;
            } else {
                ok = true;
            }
    return ok;
}
    
/**Función para pedir la cantidad de noches a reservar */
function calcularNoches(entrada, salida) {
    let entradaParseada = Date.parse(entrada);
    let salidadaParseada = Date.parse(salida);
    let cantidadNoches = ((((salidadaParseada - entradaParseada)/1000)/60)/60)/24;
    if (cantidadNoches !== 0) {
        return cantidadNoches;
    } else {
        document.getElementById('ingresoErroneo').innerHTML = `<h4
            style="color:red">La fecha de entrada y salida no debe ser la misma
            </h4>`;
        return 0;
    }
}

//**Función para descontar stock de habitaciones */
function descontarStock(cantidadPedida, id) {
    habitaciones[id-1].stock -= cantidadPedida;
}

//**Función para agregar lo pedido a la reserva */
function subirAReserva(id, nombre, precio, cantidad, entrada, salida) {
    reserva.push(new Reserva(id, nombre, precio, cantidad, entrada, salida));
    console.log(reserva);
} 

//**Función para mostrar la última habitación agregada */
function mostrarReserva(cantidad, nombre) {
    document.getElementById('agregadoAReserva').innerHTML = `
        <h4 style="font-weight:bold">Se ha agregado a la reserva: ${cantidad} 
        noche/s en habitación ${nombre}</h4>`;
}

//**Función para guardar la reserva en el localStorage */
function guardarEnLocalStorage() {
    localStorage.setItem('reserva', JSON.stringify(reserva));
    localStorage.setItem('totalReserva', JSON.stringify(acumuladorReserva));
}


/** Generación de modal Reserva */
$("#reserva").click(verReserva);
const mostrarTotal = document.getElementById('precioTotal');

function verReserva() {
    $("#modalReserva").show();
    $("#formulario").slideUp(1000);
    const detalleReserva = $("#modalReserva");
    detalleReserva.html('');
    if (acumuladorReserva !== 0) {
        reserva.forEach(element => { 
            detalleReserva.append(`
            <p style="font-size:1.1rem"> 
            ${element.cantidad} noche/s en ${element.nombre} del ${element.entrada} al 
            ${element.salida} - $ ${element.precio} c/u - Total $ ${element.cantidad*element.precio}
            <button style="border:none; background-color:white" 
            onclick="eliminarDeReserva(${reserva.indexOf(element)})">
            <i class="fas fa-minus-circle"></i></button></p>       
            `);
        });
    } else {
        detalleReserva.append(`
            <div>
                <h4>No hay habitaciones reservadas</h4>
            </div>`);
    }
    document.getElementById('precioTotal').style.fontWeight = "bold";
    mostrarTotal.innerHTML = acumuladorReserva;
    $("#agregadoAReserva").html("");
}

//* Función para eliminar elementos de la reserva (actualiza precio total, stock y local Storage)
function eliminarDeReserva(aux) {
    acumuladorReserva -= reserva[aux].precio * reserva[aux].cantidad;
    devolverCantidadEliminadaAlStock(reserva[aux].id, reserva[aux].cantidad);
    reserva.splice(aux, 1);
    if ((reserva.length) === 0) {
        localStorage.clear();
    } else {
        guardarEnLocalStorage();
    }
    verReserva();
}

//**Función para devolver al stock la cantidad eliminada de la reserva */
function devolverCantidadEliminadaAlStock(id, cantidad) {
    habitaciones[id-1].stock += cantidad;
    console.log(habitaciones[id-1].stock);
}

//Función para generar pago por MP
async function generarPago() {
    if (reserva.length > 0) {
        const reservaParaPago = reserva.map((element) => {
            let elementoAPagar = {
                title: element.nombre,
                description: "",
                picture_url: "",
                category_id: element.id,
                quantity: Number(element.cantidad),
                currency_id: "ARS",
                unit_price: Number(element.precio),
            };
            return elementoAPagar;
        });
        console.log(reservaParaPago);
        const response = await fetch("https://api.mercadopago.com/checkout/preferences",{
            method: "POST",
            headers: {
                Authorization: "Bearer TEST-4559372510592656-052123-aff869a0f602f03b3b82c52239cf67db-80359143",
            },
            body: JSON.stringify({
                items: reservaParaPago,
            }),
        });
        const data = await response.json();
        window.open(data.init_point, "_blank");
        console.log(data)
        /* finalDePago(data.id) */
        vaciarReserva();
    }
}

//Función para vaciar la Reserva luego del pago,
// considerando que siempre se haya efectuado exitosamente.
function vaciarReserva() {
    while (reserva.length > 0) {
        reserva.forEach(elemento => {
            eliminarDeReserva(reserva.indexOf(elemento));
        })
    }
    $("#modalReserva").hide();
}


//Intento de conseguir el status de pago
// para vaciar la reserva solo si el pago fue aprobado

/* async function finalDePago(id) {
    const respuestaPago = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer TEST-4559372510592656-052123-aff869a0f602f03b3b82c52239cf67db-80359143",
        },
    });
    const pagoAprobado = await respuestaPago.json();
    console.log(pagoAprobado)
} */