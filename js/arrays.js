//** Constructor para objeto Habitacion */
class Habitacion {
    constructor (id, nombre, descripcion, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }
} 

//** Definición del array habitaciones */
detalle1 = ["Alójese en una estancia diseñada con gusto exquisito, con vista al jardín", "2 personas", "1 cama doble o 2 camas simples", "TV", "ventilador"];
detalle2 = ["Acogedora estancia con dos dormitorios, el principal con vista al mar", "4 personas", "1 cama queen + 2 camas simples", "Set café/té", "Microondas"];
detalle3 = ["Disfrute del espacio y el lujo sin límites en estas maravillosas y exclusivas habitaciones con vista al mar", "2 personas", "Ordenador", "Sala de estar", "TV 40'"];


habitaciones.push(new Habitacion(1, 'ESTUDIO', detalle1, 1000, 50, "./imagenes/imgJS/imagen0.jpg"));
habitaciones.push(new Habitacion(2, "FAMILY DUPLEX", detalle2, 2000, 40, "./imagenes/imgJS/imagen1.jpg"));
habitaciones.push(new Habitacion(3, "SUITE", detalle3, 3000, 30, "./imagenes/imgJS/imagen2.jpg"));


//** Constructor para objeto Reserva */
class Reserva {
    constructor (id, nombre, precio, cantidad, entrada, salida) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.entrada = entrada;
        this.salida = salida;
    }
}

//** Constructor para objeto HabitacionLocalStorage */
class HabitacionLocalStorage {
    constructor (id, stock) {
        this.id = id;
        this.stock = stock;
    }
}