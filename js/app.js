
// Objeto que almacenará la información del pedido del cliente
let cliente = {
    mesa:'',
    hora:'',
    pedido: []
}

// Selector
const btnGuardarCliente = document.querySelector('#guardar-cliente');
const inputMesa = document.querySelector('#mesa');
const selectorHora = document.querySelector('#hora');

btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){

    const mesa = inputMesa.value;
    const hora = selectorHora.value;

    // Revisar si hay campos vacios con .some()
    const validacion = [ mesa, hora ].some( campo => campo === '' );
    
    if( validacion ){
        console.log('Todos los campos son obligatorios');
    } else{
        console.log(mesa, hora);
    }
}