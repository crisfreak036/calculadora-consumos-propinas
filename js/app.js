
// Objeto que almacenará la información del pedido del cliente
let cliente = {
    mesa:'',
    hora:'',
    pedido: []
}

// Objeto traductor de los id de categoría
const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
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

    // Mostrar las secciones
    mostrarSecciones();

    // Obtener platillos desde la API de JSON-SERVER
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    // Remueve la clase que oculta las secciones
    seccionesOcultas.forEach( seccion => {
        seccion.classList.remove('d-none');
    });
}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos';
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( platillos => mostrarPlatillos(platillos))
        .catch( error => console.log(error))
}

// Crea el formulario para el ingreso de cantidades de platillos
function mostrarPlatillos( platillos ){

    // Selector del contenedor donde se mostrarán los platillos
    const contenedorPlatillos = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const { categoria, id, nombre, precio } = platillo;

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top'); // Se le asigna la clase que da acceso al grid de bootstrap

        // Crear contenedor para el nombre del platillo
        const nombrePlatillo = document.createElement('DIV');
        nombrePlatillo.classList.add('col-md-4');
        nombrePlatillo.textContent = nombre;
        
        // Crear contenedor para el precio del platillo
        const precioPlatillo = document.createElement('DIV');
        precioPlatillo.classList.add('col-md-3', 'fw-bold');
        precioPlatillo.textContent = `$${precio}`;
        
        // Crear contenedor para la categoría del platillo
        const categoriaPlatillo = document.createElement('DIV');
        categoriaPlatillo.classList.add('col-md-3');
        categoriaPlatillo.textContent = categorias[categoria]; // Transforma de id a string la categoría

        // Crear input para la cantidad de platillo a ordenar
        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${id}`;
        inputCantidad.classList.add('form-control'); // Clase que da estilo a los inputs en bootstrap
        // Crea contenedor para el input con el objetivo de ingresar al grid de bootstrap
        const contenedorInput = document.createElement('DIV');
        contenedorInput.classList.add('col-md-2');
        contenedorInput.appendChild(inputCantidad);

        row.append(nombrePlatillo, precioPlatillo, categoriaPlatillo, contenedorInput);

        contenedorPlatillos.appendChild(row);
    });
}