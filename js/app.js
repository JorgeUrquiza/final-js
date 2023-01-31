//variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const comprarCarritoBtn = document.querySelector('#comprar-carrito');
const listaProductos = document.querySelector('#lista-productos');
let articulosCarrito = [];



cargarEventListeners();
function cargarEventListeners() {
    //Cuando agregas un producto precionando agregar al carrito
    listaProductos.addEventListener('click', agregarProducto)

    //Notificacion agregar producto
    listaProductos.addEventListener('click', () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado',
            showConfirmButton: false,
            timer: 800
        });
    })

    //Elimina productos del carrito
    carrito.addEventListener('click', eliminarProducto);

    //Muestras los productos de local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
    })

    //comprar carrito
    comprarCarritoBtn.addEventListener('click', () => {
        if(articulosCarrito == null || articulosCarrito == 0 ){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No tiene articulos en el carrito',
                });
        } else Swal.fire(
            'Realizo la compra exitosamente!',
            'Excelente!',
            'success')
        articulosCarrito = [];
        limpiarHTML();
    } )

}


// Funciones 
function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito') ) {
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }    
}

//Elimina un producto del carrito
function eliminarProducto(e) {
    if(e.target.classList.contains('borrar-producto')) {
        const productoId = e.target.getAttribute('data-id');

        //Elimina del arreglo de articulosCarrito por el id 
        articulosCarrito = articulosCarrito.filter( producto => producto.id !== productoId);

        carritoHTML();
    }
}

//Lee el contenido del HTML al que agreguemos al carrito
function leerDatosProducto(producto) {
    //crea un objeto con el contenido del producto actual
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h4').textContent,
        precio: producto.querySelector('.precio span').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( producto => producto.id === infoProducto.id );
    if(existe) {
        //Actualizamos la cantidad
        const productos = articulosCarrito.map( producto => {
            if(producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto; //retorna objeto actualizado
            } else {
                return producto; //retorna los objetos que no son duplicados
            }
        } );
        articulosCarrito = [...productos];
    } else {
        //Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    console.log(articulosCarrito);

    carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {

    //Limpiar HTML
    limpiarHTML();


    //recorre el carrito y genera el HTML
    articulosCarrito.forEach( producto => {
        const { imagen, titulo, precio, cantidad, id } = producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> <img src="${imagen}" width="100"> </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>     
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-producto" data-id="${id}"> - </a>
            </td>      
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    
    //Agregar carrito al storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Elimina los cursos  del tbody
function limpiarHTML() {
    //contenedorCarrito.innerHTML = '';
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}