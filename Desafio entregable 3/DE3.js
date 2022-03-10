class Persona{
    constructor(nombre, id) {
        this.nombre = nombre;
        this.id = id;
    }
}

class Deuda {
    constructor (fecha, total, pagador, personasIncluidasEnGasto, descripcion){
        this.fecha = fecha;
        this.total = total;
        this.pagador = pagador;
        this.personas = personasIncluidasEnGasto;
        this.cantidadPersonas = this.personas.length+1;
        this.descripcion = descripcion;
    }    
}

//Abrir popup para añadir gastos.
let botonInicial = document.getElementById("agregarGasto")
botonInicial.addEventListener("click", abrirPopup)
//prevenir el sumbit del form
document.getElementById("gastoNuevo").addEventListener("sumbit", function(event){
    event.preventDefault()
});

let añadirGasto = document.getElementById("gastoNuevoAñadir");
let eventoGasto = añadirGasto.addEventListener("click", gastoNuevoAñadir);

function gastoNuevoAñadir(){
    let fecha;
    let monto;
    let descripcion;
    let pagador;
    let deudores = [];
    fecha = document.getElementById("fecha").value;
    monto = parseFloat(document.getElementById("monto").value);
    descripcion = document.getElementById("descripcion").value;
    pagador = document.getElementById("pagador").value;
    let opciones = document.getElementById("deudores");
    for(const d of opciones){
        let deudor = new Persona (d.value, 1);
        deudores.push(deudor); 
    }
    let idPagador = 0;
    let pagadorFinal = new Persona (pagador, idPagador);
    let deuda = new Deuda(fecha, monto, pagadorFinal, deudores, descripcion);
    agregarGastoATabla(deuda);
    let form = document.getElementById("gastoNuevo");
    //Reseteo y escondo el form
    form.reset();
    $('#exampleModal').modal('hide')
    //Debería actualizar las tarjetas con los saldos arriba, ver que onda usuarios y sesiones.
}

function agregarGastoATabla(gasto){
    let tabla;
    let fecha;
    let descripcion;	
    let precio;
    let pagadoPor;	
    let deudores;
    let deuda;	
    let saldoAFavor;
    let gastoPorPersona;
    tabla = document.getElementById("tablaGastos");
    //inserto una fila a la tabla
    let filaAgregada = tabla.insertRow();
    //inserto las celdas de las filas
    fecha = filaAgregada.insertCell(0);
    descripcion = filaAgregada.insertCell(1);
    precio = filaAgregada.insertCell(2);
    pagadoPor = filaAgregada.insertCell(3);
    deudores = filaAgregada.insertCell(4);
    deuda = filaAgregada.insertCell(5);
    saldoAFavor = filaAgregada.insertCell(6);
    filaAgregada.insertCell(7);
    // Pongo los datos de la deuda en las celdas.
    gastoPorPersona = pagadoPorPersona(gasto);
    var f = new Date();
    fecha.innerText = gasto.fecha;
    descripcion.innerText = gasto.descripcion;
    precio.innerText = "$" + gasto.total.toFixed(2);
    pagadoPor.innerText = gasto.pagador.nombre;
    deudores.innerText =  obtenerDeudoresOrdenados(gasto);
    deuda.innerText = "$" + gastoPorPersona;
    saldoAFavor.innerText = "$" +  (gastoPorPersona * (gasto.personas.length)).toFixed(2); 
}

function obtenerDeudoresOrdenados(deuda){
    let deudores = deuda.personas.filter(d => d.id != 0); //Filtro las que no tiene el id pagador = 0;
    deudores.sort((d1,d2)=> {  //ordeno el array alfabeticamente
        if (d1.nombre >d2.nombre){
            return 1;
        }
        if (d1.nombre <d2.nombre){
            return -1;
        }
        return 0;    
    })
    let nombreDeudores = [];
    for (const nombre of deudores) {
        nombreDeudores.push(nombre.nombre);
    }
    return  nombreDeudores.join(", ");
}

function pagadoPorPersona(deuda){
    let pagadoPorPersona = deuda.total/deuda.cantidadPersonas;
    console.log(pagadoPorPersona);
    return pagadoPorPersona.toFixed(2);
}

function abrirPopup(){
    $('#exampleModal').modal("show");
}