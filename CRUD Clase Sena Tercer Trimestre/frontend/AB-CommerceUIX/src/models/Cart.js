export default class Wishlist { // Clase modelo que representa una lista de deseos; estructura los datos del backend para usar en el frontend
  constructor({ // Constructor con desestructuración; crea una instancia Wishlist a partir del objeto JSON de la API
    _id = '', // ID único de MongoDB; cadena vacía por defecto al crear una lista de deseos nueva
    products = [], // Array de referencias a productos (ObjectId o objetos populados); array vacío por defecto
    id_user = '', // ID de referencia al usuario propietario de la lista (ObjectId); cadena vacía por defecto
  } = {}) { // El = {} permite llamar al constructor sin argumentos sin lanzar error de desestructuración
    this._id = _id; // Asigna el ID de MongoDB a la instancia para identificar la lista de deseos en el CRUD
    this.products = products; // Asigna el array de productos a la instancia para gestionar los elementos en la lista
    this.id_user = id_user; // Asigna la referencia al usuario propietario a la instancia para controlar el acceso
  } // Fin del constructor
} // Fin de la clase Wishlist