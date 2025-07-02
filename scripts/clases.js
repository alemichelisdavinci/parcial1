// scripts/clases.js

class Pista {
  constructor(nombre, duracion) {
    this.nombre = nombre;
    this.duracion = duracion; // en segundos
  }

  getDuracionFormateada() {
    const minutos = Math.floor(this.duracion / 60).toString().padStart(2, '0');
    const segundos = (this.duracion % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
  }
}

class Disco {
  constructor(nombre, autor, portada, codigo) {
    this.nombre = nombre;
    this.autor = autor;
    this.portada = portada;
    this.codigo = codigo;
    this.pistas = [];
  }

  agregarPista(pista) {
    this.pistas.push(pista);
  }

  getDuracionTotal() {
    return this.pistas.reduce((acc, pista) => acc + pista.duracion, 0);
  }

  getDuracionFormateada() {
    let total = this.getDuracionTotal();
    const horas = Math.floor(total / 3600).toString().padStart(2, '0');
    total %= 3600;
    const minutos = Math.floor(total / 60).toString().padStart(2, '0');
    const segundos = (total % 60).toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  }

  getDuracionPromedioFormateada() {
    if (this.pistas.length === 0) return '00:00:00';
    const promedio = Math.floor(this.getDuracionTotal() / this.pistas.length);
    const horas = Math.floor(promedio / 3600).toString().padStart(2, '0');
    const minutos = Math.floor((promedio % 3600) / 60).toString().padStart(2, '0');
    const segundos = (promedio % 60).toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  }

  getPistaMasLarga() {
    return this.pistas.reduce((max, pista) => pista.duracion > max.duracion ? pista : max, this.pistas[0]);
  }
}