function pedirNumero (vez){
let numero = parseInt(prompt("Ingrese el numero " + vez));
return numero;
}
let suma = 0;
let cantidad = prompt("Ingrese cantidad de numeros a sumar");
for(let i= 1; i-1<cantidad; i++){
    let numActual = pedirNumero(i);
    suma += numActual;
}
console.log(suma);
alert("La suma es igual a: " + suma)
