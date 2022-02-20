let gastoTotal = 0;
let deuda = 0;

while(1){
    let gasto = parseFloat(prompt("Ingrese el gasto total o 0 para continuar"));
    if(gasto == 0)
        break;
    gastoTotal += gasto;
    let personas = parseInt(prompt("Ingrese el total de personas que compartieron el gasto incluyendote a vos"));
    let tipoDeuda = prompt("¿Pago usted? (escriba si o cualquier cosa en caso de que no)");
    deuda += saldoGasto(gasto, personas, tipoDeuda);    
} 
if(deuda <= 0 ){
    alert ("Se gastó un total de: $" + gastoTotal + " y te deben un total de: $" + Math.abs(deuda));
}
else{
    alert ("Se gastó un total de: $" + gastoTotal + " y debes un total de: $" + deuda);
}

function saldoGasto(gasto, cantidadPersonas, tipoDeuda){
    let saldoDelGasto;
    let pagadoPorPersona = gasto/cantidadPersonas;
    if (tipoDeuda.localeCompare("si")  == 0){        
        saldoDelGasto = (pagadoPorPersona) * (cantidadPersonas -1) * (-1);
    }
    else{
        saldoDelGasto = pagadoPorPersona;
    }
    console.log(saldoDelGasto);
    return saldoDelGasto;
}