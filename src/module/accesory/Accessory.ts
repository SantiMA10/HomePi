export interface Accessory{
    /**
     * Método que sirve para detectar si el servidor tiene que realizar alguna acción en el estado en el que encuentra
     * el accesorio
     * @param instance es el estado del accesorio
     * @param any es un parametro opcional por si es necesario
     * @return boolean devuelve si es necesario trabajar o no
     */
    hasToWork(instance:any, any?) : boolean;

    /**
     * Metodo que contiene la logica del accesorio
     * @param any estado del accesorio
     * @return any dependiendo del accesorio
     */
    work(any) : any;
}