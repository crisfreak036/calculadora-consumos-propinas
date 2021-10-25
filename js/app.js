
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
        // Añade un mensaje de error
        if(!document.querySelector('.alerta-personalizada')){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center', 'alerta-personalizada');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            // Elimina mensaje luego de 2,5 segundos
            setTimeout(() => {
                alerta.remove();
            }, 2500);
        }
        return;
    }

    // Con Spreed Operator asigna una copia del objeto junto a los valores de mesa y hora
    cliente = { ...cliente, mesa, hora }
    
    // Ocultar Modal
    const modalFormulario = document.querySelector('#formulario'); // Selecciona modal
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario); // Lo reconoce como un elemento de bootstrap
    modalBootstrap.hide();

}