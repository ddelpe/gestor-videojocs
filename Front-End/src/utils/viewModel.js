// src/utils/viewModel.js
import Vue from 'vue';
import Model from './model';

const state = Vue.observable({
  user: null,
  loginData: { email: '', password: '' },
  registerData: { email: '', password: '' },
  videojocs: [],
  videojocActual: { _id: null, nombre: '', imagenUrl: '', descripcion: '', sitioUrl: '' },
  isEditing: false,
  error: null,
  fallbackImage: 'https://via.placeholder.com/280x180?text=Imagen+No+Disponible',
  showLogin: false,
  showRegister: false,
});

const ViewModel = {
  state,

  // Utility functions
  getSanitizedVideojocs() {
    return state.videojocs.map(videojoc => ({
      ...videojoc,
      imagenUrl: ViewModel.sanitizeUrl(videojoc.imagenUrl),
    }));
  },

  isAdmin() {
    return state.user && state.user.rol === 'admin';
  },

  isLoggedIn() {
    return !!state.user;
  },

  // Methods
  sanitizeUrl(url) {
    if (!url) return state.fallbackImage;
    if (!url.match(/^https?:\/\//)) return `https://${url}`;
    return url;
  },

  handleImageError(event) {
    event.target.src = state.fallbackImage;
    event.target.classList.add('error');
  },

  async login() {
    try {
      state.error = null;
      const user = await Model.login(state.loginData);
      state.user = user;
      state.loginData = { email: '', password: '' };
      state.showLogin = false;
      await ViewModel.carregarVideojocs();
    } catch (error) {
      state.error = error.message;
    }
  },

  async register() {
    try {
      state.error = null;
      await Model.register(state.registerData);
      state.registerData = { email: '', password: '' };
      state.showRegister = false;
      alert('Registro exitoso. Por favor, inicia sesión.');
    } catch (error) {
      state.error = error.message;
    }
  },

  logout() {
    Model.clearSession();
    state.user = null;
    state.videojocs = [];
  },

  async carregarVideojocs() {
    if (!state.user || !state.user.token) {
      state.error = 'Por favor, inicia sesión para ver los videojuegos';
      return;
    }
    try {
      state.videojocs = await Model.fetchVideojocs(state.user.token);
      state.error = null;
    } catch (error) {
      if (error.message === 'Sesión expirada') {
        ViewModel.logout();
        state.error = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else {
        state.error = error.message;
      }
    }
  },

  async guardarVideojoc() {
    if (!ViewModel.isAdmin()) return;
    try {
      console.log('Guardando videojuego:', state.videojocActual);
      const videojocToSave = {
        ...state.videojocActual,
        imagenUrl: ViewModel.sanitizeUrl(state.videojocActual.imagenUrl),
        sitioUrl: ViewModel.sanitizeUrl(state.videojocActual.sitioUrl),
      };
      const videojoc = await Model.saveVideojoc(videojocToSave, state.isEditing, state.user.token);
      console.log('Videojuego recibido del backend:', videojoc);
      if (state.isEditing) {
        const index = state.videojocs.findIndex(v => v._id === videojoc._id);
        if (index !== -1) {
          Vue.set(state.videojocs, index, videojoc);
        } else {
          console.warn('Videojuego editado no encontrado en la lista:', videojoc._id);
        }
      } else {
        if (!videojoc._id) {
          console.warn('El videojuego devuelto no tiene _id, recargando lista de videojuegos:', videojoc);
          await ViewModel.carregarVideojocs();
        } else {
          state.videojocs.push(videojoc);
        }
      }
      ViewModel.resetFormulari();
      state.error = null;
    } catch (error) {
      console.error('Error en guardarVideojoc:', error);
      state.error = error.message;
    }
  },

  editarVideojoc(videojoc) {
    if (!ViewModel.isAdmin()) return;
    state.videojocActual = { ...videojoc };
    state.isEditing = true;
  },

  async eliminarVideojoc(id) {
    if (!ViewModel.isAdmin()) return;
    if (!confirm('¿Seguro que quieres eliminar este videojuego?')) return;
    try {
      console.log('Eliminando videojuego con ID:', id, 'Usuario:', state.user);
      if (!id) {
        throw new Error('ID de videojuego no válido');
      }
      if (!state.user || !state.user.token) {
        throw new Error('No hay token de usuario disponible');
      }
      await Model.deleteVideojoc(id, state.user.token);
      state.videojocs = state.videojocs.filter(v => v._id !== id);
      state.error = null;
    } catch (error) {
      console.error('Error en eliminarVideojoc:', error);
      state.error = error.message;
    }
  },

  visitarSitio(url) {
    window.open(url, '_blank');
  },

  resetFormulari() {
    state.videojocActual = { _id: null, nombre: '', imagenUrl: '', descripcion: '', sitioUrl: '' };
    state.isEditing = false;
  },

  checkSession() {
    console.log('CheckSession iniciado');
    const session = Model.getSession();
    if (session) {
      state.user = session;
      console.log('Sesión detectada, llamando a carregarVideojocs');
      ViewModel.carregarVideojocs();
    } else {
      state.user = null;
      state.videojocs = [];
      console.log('No hay sesión activa');
    }
  },

  init() {
    ViewModel.checkSession();
  },
};

export default ViewModel;