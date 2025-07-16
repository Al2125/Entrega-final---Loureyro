//Registro de libros    
    // Obtener elementos del DOM
    let formulario = document.getElementById("agregar-libro");
    let form = document.getElementById("form-libro");
    let listaLibrosLeidos = []

    //Agregar libros guardados
    document.addEventListener('DOMContentLoaded', ()=> {
        columnaRegistro.classList.remove("expandida");
        columnaRegistro.classList.add("oculta")
        let librosGuardados = localStorage.getItem("libros")
        if (librosGuardados) {
            let listaLibros = JSON.parse(librosGuardados);
            listaLibros.forEach(libro => {
                agregarLibro(libro)
            });
        }
    });
    
    // Evento al enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Obtener los valores del formulario
        let titulo = form.titulo.value;
        let autor = form.autor.value;
        let mes = form.mes.value;
        let genero = form.genero.value;
        let puntos = form.puntos.value;

        let libro = {
            id: Date.now(),
            titulo: titulo,
            autor: autor,
            mes: mes,
            genero: genero,
            puntos: puntos,
        };

        agregarLibro(libro); 
        form.reset();        
    });

    function agregarLibro(libro) {
        let nuevoLibro = document.createElement('div');
        let mesLeido = document.getElementById(`${libro.mes}`);

        nuevoLibro.innerHTML = `
            <div class="tarjeta-libro">
                <p class="titulo"><strong>${libro.titulo}</strong></p>
                <p class="autor">${libro.autor}</p>
                <p class="genero">${libro.genero}</p>
                <p class="puntos">${generarEstrellas(libro.puntos)}</p> 
                <button class="editar">Editar</button>
                <button class="eliminar">Eliminar</button>
            </div>
        `;

        mesLeido.append(nuevoLibro);

        // Asignar eventos a los botones
        conectarEventos(nuevoLibro, libro);
        listaLibrosLeidos.push(libro)
        localStorage.setItem("libros", JSON.stringify(listaLibrosLeidos))
    }

    // Conecta los eventos de editar y eliminar a una tarjeta de libro
    function conectarEventos(nodoLibro, libro) {
        let btnEditar = nodoLibro.querySelector(".editar");
        let btnEliminar = nodoLibro.querySelector(".eliminar");

        // Eliminar el libro
        btnEliminar.addEventListener("click", () => {
            nodoLibro.remove();
            indice = listaLibrosLeidos.findIndex (l => l.id === libro.id);
            listaLibrosLeidos.splice(indice, 1)
            localStorage.setItem("libros", JSON.stringify(listaLibrosLeidos));
        });

        // Editar el libro
        btnEditar.addEventListener("click", () => {
            iniciarEdicion(nodoLibro, libro);
        });
    }
    function generarEstrellas(puntos){
        let estrellas ="";
        for (let i = 1; i<= 5; i++) {
            estrellas += i <= puntos ? "★" : "☆";
        }
        return estrellas;
    }
    // Cambia el contenido de una tarjeta para permitir edición
    function iniciarEdicion(nodoLibro, libro) {
        let tituloActual = nodoLibro.querySelector(".titulo");
        let autorActual = nodoLibro.querySelector(".autor");
        let generoActual = nodoLibro.querySelector(".genero");
        let puntosActual = nodoLibro.querySelector(".puntos");

        // Reemplazar texto por inputs
        tituloActual.innerHTML = `<input type="text" value="${libro.titulo}" class="input-edicion titulo">`;
        autorActual.innerHTML = `<input type="text" value="${libro.autor}" class="input-edicion autor">`;
        generoActual.innerHTML = `
            <select class="input-edicion genero" required>
                <option value="">Seleccioná un género</option>
                <option value="fantasía" ${libro.genero === "fantasía" ? "selected" : ""}>Fantasía</option>
                <option value="ciencia ficción" ${libro.genero === "ciencia ficción" ? "selected" : ""}>Ciencia Ficción</option>
                <option value="romance" ${libro.genero === "romance" ? "selected" : ""}>Romance</option>
                <option value="misterio" ${libro.genero === "misterio" ? "selected" : ""}>Misterio</option>
                <option value="terror" ${libro.genero === "terror" ? "selected" : ""}>Terror</option>
                <option value="no ficción" ${libro.genero === "no ficción" ? "selected" : ""}>No Ficción</option>
                <option value="histórico" ${libro.genero === "histórico" ? "selected" : ""}>Histórico</option>
            </select>`;
        puntosActual.innerHTML = `<input type="number" value="${libro.puntos}" class="input-edicion puntos" max="5" min="1">`;

        let btnEditar = nodoLibro.querySelector(".editar");
        let btnEliminar = nodoLibro.querySelector(".eliminar");

        btnEditar.style.display = "none"; // Ocultar botón editar

        // Crear botón guardar
        let btnGuardar = document.createElement("button");
        btnGuardar.textContent = "Guardar";
        btnGuardar.className = "guardar";
        btnEliminar.before(btnGuardar); // Insertar antes del de eliminar

        // Evento al hacer clic en "Guardar"
        btnGuardar.addEventListener("click", () => {
            // Guardar los nuevos valores
            libro.titulo = nodoLibro.querySelector(".titulo input").value;
            libro.autor = nodoLibro.querySelector(".autor input").value;
            libro.genero = nodoLibro.querySelector(".genero select").value;
            libro.puntos = nodoLibro.querySelector(".puntos input").value;

            // Reemplazar el contenido con los valores actualizados
            nodoLibro.innerHTML = `
                <div class="tarjeta-libro">
                    <p class="titulo"><strong>${libro.titulo}</strong></p>
                    <p class="autor">${libro.autor}</p>
                    <p class="genero">${libro.genero}</p>
                    <p class="puntos">${generarEstrellas(libro.puntos)}</p>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </div>
            `;

            // Volver a conectar eventos a los botones nuevos
            conectarEventos(nodoLibro, libro);

            //Guardar en localStorage
            let indice = listaLibrosLeidos.findIndex(l => l.id === libro.id);
            listaLibrosLeidos[indice] = libro;
            localStorage.setItem("libros", JSON.stringify(listaLibrosLeidos))
        });
    }
//Mostrar y ocultar recomendador
let botonToggle = document.getElementById("toggle-recomendador");
let columnaRecomendador = document.getElementById("seccion-recomendaciones");
let columnaRegistro = document.getElementById("registro")

botonToggle.addEventListener("click", () => {
    const oculto = columnaRecomendador.classList.toggle("oculto");
    if(oculto){
        botonToggle.textContent ="Mostrar recomendador";
        columnaRegistro.classList.add("expandida");
        columnaRegistro.classList.remove("oculta")
    }
    else{
        botonToggle.textContent ="Ocultar recomendador";
        columnaRegistro.classList.remove("expandida");
        columnaRegistro.classList.add("oculta")
    }



});


//Recomendador

    let btonRecomendacion = document.getElementById("boton-recomendacion");
    let seccionRecomendaciones = document.getElementById("recomendaciones");
    let btnGeneroRec = document.getElementById("genero-rec");
    let generoBuscado = {
        "fantasía":"fantasy",
        "ciencia ficción":"science-fiction",
        "romance":"romance",
        "misterio":"mystery",
        "terror":"horror",
        "no ficción":"non-fiction",
        "histórico":"history"
    };



    btonRecomendacion.addEventListener("click", (event)=>{
        event.preventDefault()
        let generoTraducido = btnGeneroRec.value;
        let url = generoTraducido 
        ? `https://openlibrary.org/search.json?subject=${generoTraducido}`
        : `https://openlibrary.org/search.json?q=books`;

        fetch(url)
            .then (resultado => resultado.json())
            .then(data => {
                seccionRecomendaciones.innerHTML= "";

                let librosElegidos=data.docs.sort(() => Math.random() - 0.5).slice(0, 5)

                librosElegidos.forEach( l => {
                    let libroRecomendado = document.createElement("div");
                    libroRecomendado.className = "libro-recomendado";

                    libroRecomendado.innerHTML= `
                    <img src="${`https://covers.openlibrary.org/b/id/${l.cover_i}-M.jpg`}"/>
                        <p>${l.title}</p>
                        <p>${l.author_name}</p>
                    `;
                seccionRecomendaciones.append(libroRecomendado);

                })
            })
    });

    //listaLibros = JSON.parse(librosGuardados);