class Persona{
    constructor(nombre) {
        this.nombre = nombre;
    }
}

class Deuda {
    constructor (total, pagador, personasIncluidasEnGasto){
        this.total = total;
        this.pagador = pagador;
        this.personas = personasIncluidasEnGasto;
        this.cantidadPersonas = this.personas.length;
    }    
}

let intentos = parseInt(prompt("Ingrese cantidad de veces que quiere probar ingresar un gasto"));
for ( let i = 0; i<intentos; i++){
    let deuda = ingresarGasto();
    imprimirDetalle(deuda, pagadoPorPersona(deuda));
}


function ingresarGasto(){
let personas = [];
let gasto = parseFloat(prompt("Ingrese el gasto total a ingresar"));
let nombre = prompt("Ingrese el nombre de la persona que pagó");
let pagador = new Persona (nombre);
personas.push(pagador);
let cantidadPersonas = parseInt(prompt("Ingrese el total de personas que compartieron el gasto incluyendo a la persona que pagó"));
for(let i = 1; i<cantidadPersonas; i++){
    let nombre = prompt("Ingrese el nombre de la persona " + i + " que está en DEUDA");
    let deudor = new Persona (nombre);
    personas.push(deudor);
}
let deuda = new Deuda(gasto, pagador, personas);
return deuda;
}

function imprimirDetalle(deuda, pagadoPorPersona){
    let deudores = deuda.personas.slice(1, deuda.personas.length);
    let nombreDeudores = [];
    for (const nombre of deudores) {
        nombreDeudores.push(nombre.nombre);
    }
    alert ("Se gastó un total de $" + 
    deuda.total + " y " + 
    nombreDeudores.join(", ") + " debe/n al usuario " +
    deuda.pagador.nombre +  " un total de $" + 
    pagadoPorPersona * (deuda.personas.length -1) + " pagando un total de $" + 
    pagadoPorPersona + " cada uno.");
}

function pagadoPorPersona(deuda){
    let pagadoPorPersona = deuda.total/deuda.cantidadPersonas;
    console.log(pagadoPorPersona);
    return pagadoPorPersona;
}