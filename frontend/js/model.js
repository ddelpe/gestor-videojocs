class VideojocModel {
  constructor() {
    this.videojocs = [];
  }

  async fetchVideojocs() {
    // Simulem una crida al backend
    this.videojocs = [
      { id: 1, titol: "The Legend of Zelda", plataforma: "Switch" },
      { id: 2, titol: "GTA V", plataforma: "PS5" }
    ];
    return this.videojocs;
  }

  async afegirVideojoc(videojoc) {
    const nouVideojoc = { id: this.videojocs.length + 1, ...videojoc };
    this.videojocs.push(nouVideojoc);
    return nouVideojoc;
  }

  async actualitzarVideojoc(videojoc) {
    const index = this.videojocs.findIndex(v => v.id === videojoc.id);
    if (index !== -1) this.videojocs[index] = videojoc;
    return videojoc;
  }

  async eliminarVideojoc(id) {
    this.videojocs = this.videojocs.filter(v => v.id !== id);
  }
}