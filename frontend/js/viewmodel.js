class VideojocViewModel {
  constructor(model) {
    this.model = model;
    this.videojocActual = { id: null, titol: "", plataforma: "" };
    this.isEditing = false;
  }

  async carregarVideojocs() {
    await this.model.fetchVideojocs();
  }

  async guardarVideojoc() {
    if (this.isEditing) {
      await this.model.actualitzarVideojoc({ ...this.videojocActual });
    } else {
      await this.model.afegirVideojoc({ ...this.videojocActual });
    }
    this.resetFormulari();
  }

  editarVideojoc(videojoc) {
    this.videojocActual = { ...videojoc };
    this.isEditing = true;
  }

  async eliminarVideojoc(id) {
    await this.model.eliminarVideojoc(id);
  }

  resetFormulari() {
    this.videojocActual = { id: null, titol: "", plataforma: "" };
    this.isEditing = false;
  }
}