 import Tags from "https://cdn.jsdelivr.net/gh/lekoala/bootstrap5-tags@master/tags.js";
    Tags.init("select[multiples]");

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
    }    
}
class Grupo {
    constructor(nombre, descripcion, integrantes){
        this.nombre = nombre;
        this.descripcion= descripcion;
        this.integrantes = integrantes;
    }
}

let usuarioPrincipal; //Var global
let grupos = [];
//Si encuentra el nombre del usuario principal
usuarioPrincipal = JSON.parse(localStorage.getItem("0"));
if (usuarioPrincipal == null){
    popup("#popupUserPrincipal", "show");
}else{
    iniciar();
}

//Usuario principal
document.getElementById("añadirUserPrincipal").addEventListener("click", validarUserPrincipal);
//Eventos para añadir los gastos.
document.getElementById("agregarGasto").addEventListener("click", validarGasto);
document.getElementById("cancelarGasto").addEventListener("click", () =>{popup("#exampleModal", "hide")});
document.getElementById("gastoNuevoAñadir").addEventListener("click", gastoNuevoAñadir);
document.getElementById("cerrarPopup").addEventListener("click", () =>{popup("#exampleModal", "hide")});
document.getElementById("gastoNuevo").addEventListener("sumbit", function(event){
    //prevenir el sumbit del form
    event.preventDefault()
});
//Eventos para grupos
document.getElementById("cancelarGrupo").addEventListener("click", () =>{popup("#popupNuevoGrupo", "hide")});
document.getElementById("cerrarPopupGrupo").addEventListener("click", () =>{popup("#popupNuevoGrupo", "hide")});
document.getElementById("agregarGrupo").addEventListener("click", ()=> {popup("#popupNuevoGrupo","show");});
document.getElementById("añadirGrupo").addEventListener("click", agregarGrupo);
document.getElementById("pagadoPorMi").addEventListener("change", validarCheck);


//Funciones
function iniciar(){
    //Ver como recuperar grupo, por el momento crear uno nuevo 
    // for (let i = 0; i< localStorage.length; i++){
    //     if(/^Grupo/.test(localStorage.key(i))){
    //         //Recuperar el grupo   
    //     }
    // } 
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
    pagador = document.getElementById("pagador").value;
    let opciones = document.getElementById("deudores");
    for(const d of opciones){
        let i = 1;
        if (d.selected){
            let deudor = new Persona (d.value, i);
            deudores.push(deudor); 
        }
        i++;
    }
    let idPagador = 0;
    let pagadorFinal = new Persona (pagador, idPagador);
    let deuda = new Deuda(fecha, monto, pagadorFinal, deudores, descripcion);
    agregarGastoATabla(deuda);
    //Reseteo y escondo el form
    document.getElementById("gastoNuevo").reset();
    popup("#exampleModal", "hide");
    //Debería actualizar las tarjetas con los saldos arriba, ver que onda usuarios y sesiones.
}

function noHayGrupo(){ //Habria que Validar correctamente
    return document.getElementById("detGrupo").innerText == "Detalles del grupo";
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
    fecha.innerText = gasto.fecha;
    descripcion.innerText = gasto.descripcion;
    precio.innerText = "$" + gasto.total.toFixed(2);
    pagadoPor.innerText = gasto.pagador.nombre;
    deudores.innerText =  obtenerDeudoresOrdenados(gasto);
    deuda.innerText = "$" + gastoPorPersona;
    saldoAFavor.innerText = "$" +  (gastoPorPersona * (gasto.personas.length)).toFixed(2); 
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

function agregarGrupo(){
    let lugarAgregar = document.getElementById("gruposNuevitos");
    let listaNueva = document.createElement("li");
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
    listaNueva.innerHTML =`<a class="nav-link" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>${grupo.nombre}</a>`;
    lugarAgregar.append(listaNueva);
    document.getElementById("detGrupo").innerHTML = ` <h2 id="detGrupo" >Detalles del grupo: ${nombre} </h3> `;
    document.getElementById("integrantesActuales").innerHTML = ` <h3 >Integrantes: ${nombreIntegrantesFinales.join(", ")} </h3> `;
    document.getElementById("grupoNuevo").reset();
    popup("#popupNuevoGrupo", "hide");
    let existe = false;
    for(let i= 0 ; i<localStorage.length; i++){
        if( `Grupo ${nombre}` == localStorage.key(i)){
            existe = true;
        }
    }
    if(!existe){
        localStorage.setItem(`Grupo ${nombre}`,JSON.stringify(grupo));
    }
    grupos.push(grupo);
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
        if(document.getElementById("pagador").options.length != grupos[0].integrantes.length){
            prepararOpcionesForms();
        }
        popup("#exampleModal", "show")
    }
}


function prepararOpcionesForms(){
    let opcionesPagador = document.getElementById("pagador");
    let opcionesDeudor = document.getElementById("checkDeudores");
    let i = 0;
    //Agregar todos los integrantes del grupo
    //Por ahora le paso el primer grupo, despues deberia chequear grupo actual.
    for (const integrantes of grupos[0].integrantes) {
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
    //TODO preparar opciones check
 }