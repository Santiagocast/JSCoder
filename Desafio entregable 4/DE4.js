 import Tags from "https://cdn.jsdelivr.net/gh/lekoala/bootstrap5-tags@master/tags.js";
    Tags.init("select[multiples]");

//TODO: Boton para borrar grupos
    //(Borrar de la lista, storage y traer info del primer grupo ver que pasa si es el unico grupo)
//TODO: Por ahora los grupos son inmutables, ver si agregar personas al grupo (En un futuro)
//TODO: Liquidar deuda ver como agregar a la tabla
//TODO: Poner estado a las deudas. (Saldada o no saldada)

//Clases
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
        this.pagadoPorPersona = pagadoPorPersona(this);
    }    
}
class Grupo {
    constructor(nombre, descripcion, integrantes){
        this.nombre = nombre;
        this.descripcion= descripcion;
        this.integrantes = integrantes;
        this.deudas = [];
    }
}

//Variables globales
let usuarioPrincipal; 
let grupos = [];
let indiceGrupoSeleccionado = 0;

//Si encuentra el nombre del usuario principal
usuarioPrincipal = localStorage.getItem("0");
if (usuarioPrincipal == null){ //Debería ser la primera vez que abre
    //Por las dudas limpiar storage
    localStorage.clear();
    popup("#popupUserPrincipal", "show");
}else{ //puede haber grupos
    iniciar();
}

//Eventos
    //Usuario principal
document.getElementById("añadirUserPrincipal").addEventListener("click", validarUserPrincipal);
    //Eventos para añadir los gastos.
document.getElementById("agregarGasto").addEventListener("click", validarGasto);
document.getElementById("cancelarGasto").addEventListener("click", () =>{popup("#exampleModal", "hide")});
document.getElementById("gastoNuevoAñadir").addEventListener("click", gastoNuevoAñadir);
document.getElementById("cerrarPopup").addEventListener("click", () =>{popup("#exampleModal", "hide")});
document.getElementById("gastoNuevo").addEventListener("sumbit", function(event){
    event.preventDefault()}); //prevenir el sumbit del form
    //Eventos para grupos
document.getElementById("cancelarGrupo").addEventListener("click", () =>{popup("#popupNuevoGrupo", "hide")});
document.getElementById("cerrarPopupGrupo").addEventListener("click", () =>{popup("#popupNuevoGrupo", "hide")});
document.getElementById("agregarGrupo").addEventListener("click", ()=> {popup("#popupNuevoGrupo","show");});
document.getElementById("añadirGrupo").addEventListener("click", agregarGrupo);
document.getElementById("pagadoPorMi").addEventListener("change", validarCheck);
document.getElementById("pagador").addEventListener("change", validarOpciones);
    //Eventos para eliminar Gastos
document.getElementById("eliminarGastos").addEventListener("click",eliminarGastos);

//Funciones
function iniciar(){
    //Traigo los grupos
    usuarioPrincipal = JSON.parse(localStorage.getItem("0"));
    for (let i = 0; i< localStorage.length; i++){
        if(/^Grupo/.test(localStorage.key(i))){
            let grupoActual = JSON.parse(localStorage.getItem(localStorage.key(i)))
            grupos.push(grupoActual);
            actualizarDetallesGrupo(grupos[grupos.length-1],i);
            agregarEventListener(i);
        }
    }
    if(grupos.length !=0){
        traerInfoGrupoActual(indiceGrupoSeleccionado);
        actualizarTarjetas(indiceGrupoSeleccionado);
    }
}

function limpiarTabla(){
    let filas = document.getElementById("movimientos");
    while(filas.hasChildNodes()){
        filas.removeChild(filas.lastChild)
    }
}

function gastoNuevoAñadir(){
    let fecha;
    let monto;
    let descripcion;
    let pagador;
    let deudores = [];
    fecha = document.getElementById("fecha").value;
    monto = parseFloat(document.getElementById("monto").value);
    descripcion = document.getElementById("descripcion").value;
    pagador = document.getElementById("pagador");
    let opciones = document.getElementById("checkDeudores");
    let cantidadChecks = opciones.children.length;
    for(let i = 0; i<cantidadChecks; i++){
        let ch = document.getElementById("ch"+i);
        let deudor;
        if (ch.checked){
            deudor = grupos[indiceGrupoSeleccionado].integrantes[i];                              
            deudores.push(deudor); 
        }
    }
    pagador = grupos[indiceGrupoSeleccionado].integrantes[pagador.selectedIndex];                 
    let deuda = new Deuda(fecha, monto, pagador, deudores, descripcion);
    agregarGastoATabla(deuda);
    //Reseteo y escondo el form
    document.getElementById("gastoNuevo").reset();
    popup("#exampleModal", "hide");
    //Agregar gasto al grupo
    grupos[indiceGrupoSeleccionado].deudas.push(deuda);                                          
    actualizarGrupo(indiceGrupoSeleccionado);
    actualizarTarjetas(indiceGrupoSeleccionado); 
}

function noHayGrupo(){
    return grupos.length == 0;
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
    let eliminar;
    tabla = document.getElementById("movimientos");
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
    eliminar = filaAgregada.insertCell(7);
    // Pongo los datos de la deuda en las celdas.
    gastoPorPersona = gasto.pagadoPorPersona;
    fecha.innerText = gasto.fecha;
    descripcion.innerText = gasto.descripcion;
    precio.innerText = "$" + gasto.total.toFixed(2);
    pagadoPor.innerText = gasto.pagador.nombre;
    deudores.innerText =  obtenerDeudoresOrdenados(gasto);
    deuda.innerText = "$" + gastoPorPersona;
    saldoAFavor.innerText = "$" +  (gastoPorPersona * (gasto.personas.length)).toFixed(2); 
    let botonEliminar = document.createElement("input");
    botonEliminar.type = "checkbox";
    eliminar.className ="td align-middle";
    eliminar.append(botonEliminar);

    //Agregar gastos al grupo correspondiente
}

function actualizarGrupo(indiceGrupo){
    localStorage.setItem(`Grupo ${grupos[indiceGrupo].nombre}`, JSON.stringify(grupos[indiceGrupo]));
}

function eliminarGastos(){
    let movimientos = document.getElementById("movimientos");
    for(let i = movimientos.children.length-1 ; i>= 0 ;i --){
        if(movimientos.children[i].cells[7].children[0].checked){
            movimientos.removeChild(movimientos.children[i]);
            grupos[indiceGrupoSeleccionado].deudas.splice(i,1);
        }
    }
    actualizarGrupo(indiceGrupoSeleccionado); //Actualizo en el storage el grupo
    actualizarTarjetas(indiceGrupoSeleccionado);
}
function obtenerDeudoresOrdenados(deuda){
    let deudores = deuda.personas.sort((d1,d2)=> {  //ordeno el array alfabeticamente
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

function popup(id, accion){
    $(id).modal(accion);
}

function recuperarGastosGrupo(indiceGrupo){
    //Limpio la tabla
    limpiarTabla();
    for (const d of grupos[indiceGrupo].deudas) {
        agregarGastoATabla(d);
    }
}

function agregarGrupo(){
    let nombre = document.getElementById("nombreGrupo").value;
    let descripcion = document.getElementById("descripcionGrupo").value;
    let integrantes = document.getElementById("integrantes");
    let integrantesFinales = [];
    let nombreIntegrantesFinales = [];
    integrantesFinales.push(usuarioPrincipal);
    nombreIntegrantesFinales.push(usuarioPrincipal.nombre);
    for (const integrante of integrantes) {
        let i = 1;
        if (integrante.selected){
            integrantesFinales.push(new Persona (integrante.value, i));
            nombreIntegrantesFinales.push(integrante.value);
        }        
        i++;
    }
    let grupo = new Grupo(nombre,descripcion,integrantesFinales);
    document.getElementById("grupoNuevo").reset();
    popup("#popupNuevoGrupo", "hide");
    let key  = validarStorageGrupo(grupo);
    localStorage.setItem(key,JSON.stringify(grupo));
    grupos.push(grupo);
    limpiarTabla();
    actualizarDetallesGrupo(grupos[grupos.length-1],grupos.length);
    agregarEventListener(grupos.length);
    indiceGrupoSeleccionado = grupos.length-1;   
}

function actualizarDetallesGrupo(grupo, indiceEnStorage){
    let lugarAgregar = document.getElementById("gruposNuevitos");
    let listaNueva = document.createElement("li");
    listaNueva.innerHTML =`<a class="nav-link" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>${grupo.nombre}</a>`;
    listaNueva.id = "grupo" + indiceEnStorage;
    lugarAgregar.append(listaNueva);
    mostrarDatosGrupoPantallaPrincipal(grupo);
    actualizarTarjetas(indiceEnStorage-1)
}

function mostrarDatosGrupoPantallaPrincipal(grupo){
    let nombreIntegrantesFinales = [];
    for (const i of grupo.integrantes) {
        nombreIntegrantesFinales.push(i.nombre);        
    }
    document.getElementById("detGrupo").innerHTML = ` <h2 id="detGrupo" >Detalles del grupo: ${grupo.nombre} </h2> `;
    document.getElementById("integrantesActuales").innerHTML = ` <h4 >Integrantes: ${nombreIntegrantesFinales.join(", ")} </h4> `;
}

function agregarEventListener(indiceGrupo){
    let grupoActual = document.getElementById(`grupo${indiceGrupo}`);
    grupoActual.addEventListener("click", () =>{ traerInfoGrupoActual(indiceGrupo-1)});

}

function traerInfoGrupoActual(indiceGrupo){
    let grupoActual = grupos[indiceGrupo];
    console.log(`Entraste a un grupo ${grupoActual.nombre}`);
    mostrarDatosGrupoPantallaPrincipal(grupoActual);
    recuperarGastosGrupo(indiceGrupo);
    actualizarTarjetas(indiceGrupo);
    indiceGrupoSeleccionado = indiceGrupo; 
    prepararOpcionesForms();
}

function actualizarTarjetas(indiceGrupo){
    let deuda = document.getElementById("tarjetaDeuda");
    let aFavor = document.getElementById("tarjetaFavor");
    let total = document.getElementById("tarjetaTotal");
    let subtotal = 0;
    let subDeuda = 0;
    let subFavor = 0;
    for (const deuda of grupos[indiceGrupo].deudas) {
        subtotal += deuda.total
        if(deuda.pagador.id == 0){
            subFavor += deuda.total - deuda.pagadoPorPersona;
        }else{
            for (const persona of deuda.personas) {
                if(persona.id == 0){
                    subDeuda += parseFloat(deuda.pagadoPorPersona);
                }
            }
        }
    }    
    deuda.innerText = `$ ${subDeuda.toFixed(2)}`;
    aFavor.innerText = `$ ${subFavor.toFixed(2)}`;
    total.innerText = `$ ${subtotal.toFixed(2)}`;
}

function limpiarNodo(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function validarUserPrincipal(){
    let user;
    let usuario = document.getElementById("userPrincipal").value;
    if(usuario.localeCompare("") ==0){
        alert("Ingrese nombres válido");
    }
    else{
        usuario = document.getElementById("userPrincipal").value;
        user = new Persona(usuario, 0);
        localStorage.setItem(user.id, JSON.stringify(user))
        popup("#popupUserPrincipal", "hide");
        usuarioPrincipal = JSON.parse(localStorage.getItem("0"));
        iniciar();
    }
}

function validarCheck(){
    if(document.getElementById("pagadoPorMi").checked){
        document.getElementById("pagador").disabled = true;
        document.getElementById("pagador").options.selectedIndex = 0;
    }else{
        document.getElementById("pagador").disabled = false;
    }
}

function validarGasto(){
    if(noHayGrupo()){ //Si no hay grupos crear grupo
        alert("Antes debe agregar un grupo")
        popup("#popupNuevoGrupo", "show")
    }else{
        if(document.getElementById("pagador").options.length != grupos[indiceGrupoSeleccionado].integrantes.length){  //Deberia verificar grupo y asignarselo
            prepararOpcionesForms();
        }
        popup("#exampleModal", "show");
        validarOpciones();
    }
}

function validarOpciones(){
    let checks = document.getElementById("checkDeudores").children.length;
    let opcionElegida = document.getElementById("pagador").selectedIndex;
    let check = document.getElementById("ch" + opcionElegida);
    for(let i = 0; i<checks; i++){
        let checkActual = document.getElementById("ch" + i);
        checkActual.disabled = false
    }
    check.disabled = true;
}

function validarStorageGrupo(grupo){
    let key = "Grupo " + grupo.nombre;
    for (let i = 0; i< localStorage.length; i++){
        if("Grupo " + grupo.nombre == localStorage.key(i)){
            key = "Grupo " + grupo.nombre +" (1)"
        }
    }
    return key;
}

function prepararOpcionesForms(){
    let opcionesPagador = document.getElementById("pagador");
    let opcionesDeudor = document.getElementById("checkDeudores");
    //Limpio las opciones para no tener duplicados
    limpiarNodo(opcionesPagador);
    limpiarNodo(opcionesDeudor);
    let i = 0;
    //Agregar todos los integrantes del grupo
    //Por ahora le paso el primer grupo, despues deberia chequear grupo actual.
    for (const integrantes of grupos[indiceGrupoSeleccionado].integrantes) {                                      //Deberia verificar grupo y asignarselo
        //Select
        let opcion = document.createElement("option");
        opcion.text = integrantes.nombre;
        opcionesPagador.appendChild(opcion)
        //Checks
        let div = document.createElement("div");
        div.className = "form-check"
        let check = document.createElement("input");
        let label = document.createElement("label");
        check.type = "checkbox";
        check.id = "ch" + i;
        check.className = "form-check-input";
        check.value = integrantes.nombre;
        label.className = "form-check-label";
        label.htmlFor = "ch" + i;
        label.appendChild(document.createTextNode(integrantes.nombre));
        div.append(check);
        div.append(label);
        opcionesDeudor.append(div);
        i++;
    }
 }