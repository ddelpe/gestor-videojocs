const ViewModel = {
  // State
  state: {
    user: null,
    loginData: { email: '', password: '' },
    registerData: { email: '', password: '' },
    videojocs: [],
    videojocActual: { _id: null, nombre: '', imagenUrl: '', descripcion: '', sitioUrl: '' },
    isEditing: false,
    error: null,
    fallbackImage: 'https://via.placeholder.com/280x180?text=Imagen+No+Disponible',
    showLogin: false,
    showRegister: false
  },

  // Utility functions
  getSanitizedVideojocs() {
    return ViewModel.state.videojocs.map(videojoc => ({
      ...videojoc,
      imagenUrl: ViewModel.sanitizeUrl(videojoc.imagenUrl)
    }));
  },

  isAdmin() {
    return ViewModel.state.user && ViewModel.state.user.rol === 'admin';
  },

  isLoggedIn() {
    return !!ViewModel.state.user;
  },

  // Methods
  sanitizeUrl(url) {
    if (!url) return ViewModel.state.fallbackImage;
    if (!url.match(/^https?:\/\//)) return `https://${url}`;
    return url;
  },

  handleImageError(event) {
    event.target.src = ViewModel.state.fallbackImage;
    event.target.classList.add('error');
  },

  async login() {
    try {
      ViewModel.state.error = null;
      const user = await Model.login(ViewModel.state.loginData);
      ViewModel.state.user = user;
      ViewModel.state.loginData = { email: '', password: '' };
      ViewModel.state.showLogin = false;
      await ViewModel.carregarVideojocs();
    } catch (error) {
      ViewModel.state.error = error.message;
    }
  },

  async register() {
    try {
      ViewModel.state.error = null;
      await Model.register(ViewModel.state.registerData);
      ViewModel.state.registerData = { email: '', password: '' };
      ViewModel.state.showRegister = false;
      alert('Registro exitoso. Por favor, inicia sesión.');
    } catch (error) {
      ViewModel.state.error = error.message;
    }
  },

  logout() {
    Model.clearSession();
    ViewModel.state.user = null;
    ViewModel.state.videojocs = [];
  },

  async carregarVideojocs() {
    if (!ViewModel.state.user || !ViewModel.state.user.token) {
      ViewModel.state.error = 'Por favor, inicia sesión para ver los videojuegos';
      return;
    }
    try {
      ViewModel.state.videojocs = await Model.fetchVideojocs(ViewModel.state.user.token);
      ViewModel.state.error = null;
    } catch (error) {
      if (error.message === 'Sesión expirada') {
        ViewModel.logout();
        ViewModel.state.error = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else {
        ViewModel.state.error = error.message;
      }
    }
  },

  async guardarVideojoc() {
    if (!ViewModel.isAdmin()) return;
    try {
      console.log('Guardando videojuego:', ViewModel.state.videojocActual);
      const videojocToSave = {
        ...ViewModel.state.videojocActual,
        imagenUrl: ViewModel.sanitizeUrl(ViewModel.state.videojocActual.imagenUrl),
        sitioUrl: ViewModel.sanitizeUrl(ViewModel.state.videojocActual.sitioUrl)
      };
      const videojoc = await Model.saveVideojoc(videojocToSave, ViewModel.state.isEditing, ViewModel.state.user.token);
      console.log('Videojuego recibido del backend:', videojoc);
      if (ViewModel.state.isEditing) {
        const index = ViewModel.state.videojocs.findIndex(v => v._id === videojoc._id);
        if (index !== -1) {
          Vue.set(ViewModel.state.videojocs, index, videojoc);
        } else {
          console.warn('Videojuego editado no encontrado en la lista:', videojoc._id);
        }
      } else {
        if (!videojoc._id) {
          console.warn('El videojuego devuelto no tiene _id, recargando lista de videojuegos:', videojoc);
          await ViewModel.carregarVideojocs(); // Fallback: refresh the game list
        } else {
          ViewModel.state.videojocs.push(videojoc);
        }
      }
      ViewModel.resetFormulari();
      ViewModel.state.error = null;
    } catch (error) {
      console.error('Error en guardarVideojoc:', error);
      ViewModel.state.error = error.message;
    }
  },

  editarVideojoc(videojoc) {
    if (!ViewModel.isAdmin()) return;
    ViewModel.state.videojocActual = { ...videojoc };
    ViewModel.state.isEditing = true;
  },

  async eliminarVideojoc(id) {
    if (!ViewModel.isAdmin()) return;
    if (!confirm('¿Seguro que quieres eliminar este videojuego?')) return;
    try {
      console.log('Eliminando videojuego con ID:', id, 'Usuario:', ViewModel.state.user);
      if (!id) {
        throw new Error('ID de videojuego no válido');
      }
      if (!ViewModel.state.user || !ViewModel.state.user.token) {
        throw new Error('No hay token de usuario disponible');
      }
      await Model.deleteVideojoc(id, ViewModel.state.user.token);
      ViewModel.state.videojocs = ViewModel.state.videojocs.filter(v => v._id !== id);
      ViewModel.state.error = null;
    } catch (error) {
      console.error('Error en eliminarVideojoc:', error);
      ViewModel.state.error = error.message;
    }
  },

  visitarSitio(url) {
    window.open(url, '_blank');
  },

  resetFormulari() {
    ViewModel.state.videojocActual = { _id: null, nombre: '', imagenUrl: '', descripcion: '', sitioUrl: '' };
    ViewModel.state.isEditing = false;
  },

  checkSession() {
    console.log('CheckSession iniciado');
    const session = Model.getSession();
    if (session) {
      ViewModel.state.user = session;
      console.log('Sesión detectada, llamando a carregarVideojocs');
      ViewModel.carregarVideojocs();
    } else {
      ViewModel.state.user = null;
      ViewModel.state.videojocs = [];
      console.log('No hay sesión activa');
    }
  },

  init() {
    ViewModel.checkSession();
  }
};