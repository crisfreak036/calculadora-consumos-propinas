
// Objeto que almacenará la información del pedido del cliente
let cliente = {
    mesa:'',
    hora:'',
    pedido: []
}

let aux = [];

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
        
        /* 
        inputCantidad.onchange = agregarPlatillo; // Sirve pero no puedo recibir parametros
        inputCantidad.onchange = agregarPlatillo(id); // No sirve (se manda a llamar la función sólo una vez) pero recibe parametros.
        */

        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            // Se le entrega un objeto compuesto por todo la info de platillo y cantidad
            agregarPlatillo({...platillo, cantidad});
        };
        
        // Crea contenedor para el input con el objetivo de ingresar al grid de bootstrap
        const contenedorInput = document.createElement('DIV');
        contenedorInput.classList.add('col-md-2');
        contenedorInput.appendChild(inputCantidad);

        row.append(nombrePlatillo, precioPlatillo, categoriaPlatillo, contenedorInput);

        contenedorPlatillos.appendChild(row);
    });
}

function agregarPlatillo(producto){

    // Extracción del pedido actual
    let { pedido } = cliente;

    // Verificar que la cantidad sea mayor a 0
    if(producto.cantidad > 0){
        // Verifica la existencia del producto en el arreglo de cliente
        const elementoExiste = pedido.some( (platillo) => platillo.id === producto.id );
        if(elementoExiste){
            // Busca por el id el elemento y actualiza su cantidad
            const pedidoActualizado = pedido.map( platillo => {
                if( platillo.id === producto.id ){
                    platillo.cantidad = producto.cantidad;
                }
                return platillo;
            });
            // Asigna el elemento actualizado al arreglo de pedidos 
            cliente.pedido = [...pedidoActualizado];

        } else{
            // Al no existir el elemento, asigna el contenido de pedido junto al nuevo producto al arreglo de pedido del cliente
            cliente.pedido = [...pedido, producto];
        }
    } else{
        // Quita del arreglo de pedido del cliente el elemento al que se le asigno la cantidad 0
        const resultado = pedido.filter( platillo => platillo.id !== producto.id );
        cliente.pedido = [...resultado]; 
    }
    
    // Limpiar los elementos previos del HTML en la sección del resumen
    limpiarHTML();

    // Muestra un resumen del pedido
    mostrarResumen();
}

function mostrarResumen(){
    
    if( cliente.pedido.length <= 0){
        mensajePedidoVacio();
        return;
    }

    const contenido = document.querySelector('#resumen .contenido.row');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    // Título de la sección
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Información de la mesa del cliente
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    mesa.appendChild(mesaSpan); // Se agrega al parrafo

    // Información de la hora de llegada del cliente
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');
    hora.appendChild(horaSpan); // Se agrega al parrafo

    // Iterar sobre el Array de pedidos
    const grupoPlatillos = document.createElement('UL');
    grupoPlatillos.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( platillo => {
        const { nombre, cantidad, precio, id } = platillo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        // Elemento que contendrá el nombre del platillo
        const nombreHTML = document.createElement('H4');
        nombreHTML.classList.add('my-4');
        nombreHTML.textContent = nombre;

        // Elemento que contendrá la cantidad de ordenes del platillo
        const cantidadHTML = document.createElement('P');
        cantidadHTML.classList.add('fw-bold');
        cantidadHTML.textContent = 'Cantidad: ';

        const spanCantidad = document.createElement('SPAN');
        spanCantidad.classList.add('fw-normal');
        spanCantidad.textContent = cantidad;
        cantidadHTML.appendChild(spanCantidad); // Agrega el span al parrafo

        // Elemento que contendrá el precio del platillo
        const precioHTML = document.createElement('P');
        precioHTML.classList.add('fw-bold');
        precioHTML.textContent = 'Precio Platillo: ';

        const spanPrecio = document.createElement('SPAN');
        spanPrecio.classList.add('fw-normal');
        spanPrecio.textContent = `$${precio}`;
        precioHTML.appendChild(spanPrecio); // Agrega el span al parrafo

        // Elemento que contendrá un subtotal del pedido del platillo
        const subTotalHTML = document.createElement('P');
        subTotalHTML.classList.add('fw-bold');
        subTotalHTML.textContent = 'SubTotal: ';

        const spanSubTotal = document.createElement('SPAN');
        spanSubTotal.classList.add('fw-normal');
        spanSubTotal.textContent = calcularSubTotal(precio, cantidad);
        subTotalHTML.appendChild(spanSubTotal); // Agrega el span al parrafo

        // Botón para eliminar el platillo
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';
        btnEliminar.onclick = function(){
            eliminarPlatilloPedido(id);
        }

        // Agrega los elementos al elemento LI
        lista.append(nombreHTML, cantidadHTML, precioHTML, subTotalHTML, btnEliminar);

        // Agrega el elemento LI al grupo de platillos (UL)
        grupoPlatillos.appendChild(lista);
    });

    // Agrega los elementos al resumen
    resumen.append( heading, mesa, hora, grupoPlatillos);

    // Agrega el resumen al DOM
    contenido.appendChild(resumen);

    // Muestra el formulario de propinas
    formularioPropinas();
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido.row');
    while( contenido.firstChild ){
        contenido.removeChild( contenido.firstChild );
    }
}

function calcularSubTotal(precio, cantidad){
    return `$${precio * cantidad}`;
}

function eliminarPlatilloPedido(id){
    const { pedido } = cliente;
    // Se limpia el valor del input
    const inputPlatillo = document.querySelector(`#producto-${id}`);
    inputPlatillo.value = 0;

    // Se actualiza el arreglo de pedidos
    const resultado = pedido.filter( platillo => platillo.id !== id);
    cliente.pedido = [...resultado];

    // Limpia el HTML
    limpiarHTML();

    // Muestra el nuevo resumen
    mostrarResumen();
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido.row');
    const parrafo = document.createElement('P');
    parrafo.classList.add('text-center');
    parrafo.textContent = 'Añade los elemento del pedido';
    contenido.appendChild(parrafo);    
}

function formularioPropinas(){
    
    const contenido = document.querySelector('#resumen .contenido.row');
    
    // Creación del contenedor del formulario
    const divFormularioPropina = document.createElement('DIV');
    divFormularioPropina.classList.add('col-md-6');
    divFormularioPropina.id = 'contenedor-formulario-propinas';

    // Creación del formulario
    const formularioPropina = document.createElement('DIV');
    formularioPropina.classList.add('card', 'py-2', 'px-3', 'shadow');
    // formularioPropina.id = 'formulario-propinas';

    // Título del formulario
    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Creación de los Radio Button (permite seleccionar sólo un botón de una serie de botones)
    // Propina del 10%
    // Contenedor
    const contenedorRadio10PorCiento = document.createElement('DIV');
    contenedorRadio10PorCiento.classList.add('form-check'); // Estilo del contenedor de un radio button con bootstrap

    // Input
    const radio10PorCiento = document.createElement('INPUT');
    radio10PorCiento.type = 'radio'; // Establecer tipo del input a radio
    radio10PorCiento.name = 'propina';
    radio10PorCiento.value = 10;
    radio10PorCiento.classList.add('form-check-input'); // Estilo de radio button con bootstrap

    // Label
    const radio10PorCientoLabel = document.createElement('LABEL');
    radio10PorCientoLabel.textContent = '10%'
    radio10PorCientoLabel.classList.add('form-check-label'); // Estilo de label con bootstrap

    // Evento
    radio10PorCiento.onclick = function(){
        calcularPropina();
    };

    // Agregar los elemento a su contenedor
    contenedorRadio10PorCiento.append(radio10PorCiento, radio10PorCientoLabel);

    // Propina del 25%
    // Contenedor
    const contenedorRadio25PorCiento = document.createElement('DIV');
    contenedorRadio25PorCiento.classList.add('form-check'); // Estilo del contenedor de un radio button con bootstrap

    // Input
    const radio25PorCiento = document.createElement('INPUT');
    radio25PorCiento.type = 'radio'; // Establecer tipo del input a radio
    radio25PorCiento.name = 'propina';
    radio25PorCiento.value = 25;
    radio25PorCiento.classList.add('form-check-input'); // Estilo de radio button con bootstrap

    // Label
    const radio25PorCientoLabel = document.createElement('LABEL');
    radio25PorCientoLabel.textContent = '25%'
    radio25PorCientoLabel.classList.add('form-check-label'); // Estilo de label con bootstrap

    // Evento
    radio25PorCiento.onclick = function(){
        calcularPropina();
    };

    // Agregar los elemento a su contenedor
    contenedorRadio25PorCiento.append(radio25PorCiento, radio25PorCientoLabel);

    // Propina del 50%
    // Contenedor
    const contenedorRadio50PorCiento = document.createElement('DIV');
    contenedorRadio50PorCiento.classList.add('form-check'); // Estilo del contenedor de un radio button con bootstrap

    // Input
    const radio50PorCiento = document.createElement('INPUT');
    radio50PorCiento.type = 'radio'; // Establecer tipo del input a radio
    radio50PorCiento.name = 'propina';
    radio50PorCiento.value = 50;
    radio50PorCiento.classList.add('form-check-input'); // Estilo de radio button con bootstrap

    // Label
    const radio50PorCientoLabel = document.createElement('LABEL');
    radio50PorCientoLabel.textContent = '50%'
    radio50PorCientoLabel.classList.add('form-check-label'); // Estilo de label con bootstrap

    // Agregar los elemento a su contenedor
    contenedorRadio50PorCiento.append(radio50PorCiento, radio50PorCientoLabel);

    // Evento
    radio50PorCiento.onclick = function(){
        calcularPropina();
    };


    // Agrega los elementos formulario
    formularioPropina.append(heading, contenedorRadio10PorCiento, contenedorRadio25PorCiento, contenedorRadio50PorCiento);

    // Agrega todo al div formulario
    divFormularioPropina.appendChild(formularioPropina);
    
    // Agrega el formulario al DOM
    contenido.appendChild(divFormularioPropina);
}

function calcularPropina(){
    const { pedido } = cliente;
    let subTotal = 0;
    let propina = 0;
    let totalPagar = 0;

    // Calcula el subtotal de todo el pedido iterando el arreglo de pedidos
    pedido.forEach( platillo => {
        subTotal += platillo.cantidad * platillo.precio;
    });

    // Selector de atributo para el radio button seleccionado
    const propinaSeleccionada = parseInt(document.querySelector('[name="propina"]:checked').value);
    propina = (subTotal * propinaSeleccionada) / 100; // Calculo de la propina

    totalPagar = subTotal + propina; // Calculo del total a pagar

    // Limpia un resumen de costos previo
    if(document.querySelector('#costos-pagar') != null){
        document.querySelector('#costos-pagar').remove();
    }

    // Muestra en el HTML todos los costos asociados a la orden
    mostrarCostosHTML( subTotal, propina, totalPagar );
}

function mostrarCostosHTML( subTotal, propina, totalPagar ){
    
    const contenedorFormulario = document.querySelector('#contenedor-formulario-propinas > div');

    const contenedorCostosOrden = document.createElement('DIV');
    contenedorCostosOrden.id = 'costos-pagar';
    contenedorCostosOrden.classList.add('my-5');

    // Subtotal
    const parrafoSubTotal = document.createElement('P');
    parrafoSubTotal.classList.add('fs-4', 'fw-bold', 'mt-2');
    parrafoSubTotal.textContent = 'SubTotal Consumo: ';

    const spanSubTotal = document.createElement('SPAN');
    spanSubTotal.classList.add('fw-normal');
    spanSubTotal.textContent = `$${subTotal}`;
    parrafoSubTotal.appendChild(spanSubTotal);

    // Propina
    const parrafoPropina = document.createElement('P');
    parrafoPropina.classList.add('fs-4', 'fw-bold', 'mt-2');
    parrafoPropina.textContent = 'Propina: ';

    const spanPropina = document.createElement('SPAN');
    spanPropina.classList.add('fw-normal');
    spanPropina.textContent = `$${propina}`;
    parrafoPropina.appendChild(spanPropina);

    // Total
    const parrafoTotalPagar = document.createElement('P');
    parrafoTotalPagar.classList.add('fs-2', 'fw-bold', 'mt-4');
    parrafoTotalPagar.textContent = 'Total a Pagar: ';

    const spanTotalPagar = document.createElement('SPAN');
    spanTotalPagar.classList.add('fw-normal');
    spanTotalPagar.textContent = `$${totalPagar}`;
    parrafoTotalPagar.appendChild(spanTotalPagar);

    // Inserta los elementos en su contenedor
    contenedorCostosOrden.append(parrafoSubTotal, parrafoPropina, parrafoTotalPagar);

    // Añade el contenedor al formulario
    contenedorFormulario.appendChild(contenedorCostosOrden);
}