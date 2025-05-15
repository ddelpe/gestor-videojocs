const app = new Vue({
  el: '#app',
  data: {
    viewModel: new VideojocViewModel(new VideojocModel())
  },
  computed: {
    videojocs() {
      return this.viewModel.model.videojocs;
    },
    videojocActual() {
      return this.viewModel.videojocActual;
    }
  },
  methods: {
    async guardarVideojoc() {
      await this.viewModel.guardarVideojoc();
    },
    editarVideojoc(videojoc) {
      this.viewModel.editarVideojoc(videojoc);
    },
    async eliminarVideojoc(id) {
      await this.viewModel.eliminarVideojoc(id);
    }
  },
  async created() {
    await this.viewModel.carregarVideojocs();
  }
});