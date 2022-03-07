class Persona{
    constructor(nombre, id) {
        this.nombre = nombre;
        this.id = id;
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
let nombre;
let gasto = parseFloat(prompt("Ingrese el gasto total a ingresar"));
let cantidadPersonas = parseInt(prompt("Ingrese el total de personas que compartieron el gasto incluyendo a la persona que pagó"));
if(cantidadPersonas >1){
    nombre = prompt("Ingrese el nombre de la persona que pagó");
}else{
    alert ("debe haber más de 1 persona para compartir el gasto. Vuelva a ingresar el gasto");
    return ingresarGasto();
}
let idPagador = 0;
let pagador = new Persona (nombre, idPagador);
personas.push(pagador);
for(let i = 1; i<cantidadPersonas; i++){
    let nombre = prompt("Ingrese el nombre de la persona " + i + " que está en DEUDA");
    let deudor = new Persona (nombre, i);
    personas.push(deudor);
}
let deuda = new Deuda(gasto, pagador, personas);
return deuda;
}

function imprimirDetalle(deuda, pagadoPorPersona){
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
    alert ("Se gastó un total de $" + 
    deuda.total + " y " + 
    nombreDeudores.join(", ") + " deben al usuario " +
    deuda.pagador.nombre +  " un total de $" + 
    pagadoPorPersona * (deuda.personas.length -1) + " pagando un total de $" + 
    pagadoPorPersona + " cada uno.");
}

function pagadoPorPersona(deuda){
    let pagadoPorPersona = deuda.total/deuda.cantidadPersonas;
    console.log(pagadoPorPersona);
    return pagadoPorPersona;
}