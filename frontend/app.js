const app = new Vue({
  el: '#app',
  data: {
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
  computed: {
    sanitizedVideojocs() {
      return this.videojocs.map(videojoc => ({
        ...videojoc,
        imagenUrl: this.sanitizeUrl(videojoc.imagenUrl)
      }));
    },
    isAdmin() {
      return this.user && this.user.rol === 'admin';
    },
    isLoggedIn() {
      return !!this.user;
    }
  },
  methods: {
    sanitizeUrl(url) {
      if (!url) return this.fallbackImage;
      if (!url.match(/^https?:\/\//)) return `https://${url}`;
      return url;
    },
    handleImageError(event) {
      event.target.src = this.fallbackImage;
      event.target.classList.add('error');
    },
    async login() {
      try {
        console.log('Intentando iniciar sesión con:', this.loginData);
        const response = await fetch('http://localhost:3005/api/usuarios/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginData)
        });
        console.log('Respuesta del login:', response.status, response.statusText);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
        console.log('Token recibido:', data.token, 'Rol:', data.rol);
        this.user = { token: data.token, rol: data.rol };
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        this.loginData = { email: '', password: '' };
        this.showLogin = false;
        this.error = null;
        this.carregarVideojocs();
      } catch (error) {
        console.error('Error en login:', error);
        this.error = error.message;
      }
    },
    async register() {
      try {
        console.log('Registrando usuario:', this.registerData);
        const response = await fetch('http://localhost:3005/api/usuarios/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.registerData)
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al registrarse');
        }
        this.registerData = { email: '', password: '' };
        this.showRegister = false;
        this.error = null;
        alert('Registro exitoso. Por favor, inicia sesión.');
      } catch (error) {
        console.error('Error en register:', error);
        this.error = error.message;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      this.videojocs = [];
    },
    async carregarVideojocs() {
      if (!this.isLoggedIn || !this.user.token) {
        console.log('No hay token o no está loggeado, abortando carregarVideojocs');
        this.error = 'Por favor, inicia sesión para ver los videojuegos';
        return;
      }
      try {
        console.log('Enviando solicitud a /api/videojocs con token:', this.user.token);
        const response = await fetch('http://localhost:3005/api/videojocs', {
          headers: { 'Authorization': `Bearer ${this.user.token}` }
        });
        console.log('Respuesta de /api/videojocs:', response.status, response.statusText);
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error de la API:', errorData);
          if (errorData.error === 'Token inválido') {
            this.logout();
            this.error = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            return;
          }
          throw new Error(errorData.error || 'Error al cargar videojuegos');
        }
        this.videojocs = await response.json();
        this.error = null;
      } catch (error) {
        console.error('Error en carregarVideojocs:', error);
        this.error = error.message;
      }
    },
    async guardarVideojoc() {
      if (!this.isAdmin) return;
      try {
        const videojocToSave = {
          ...this.videojocActual,
          imagenUrl: this.sanitizeUrl(this.videojocActual.imagenUrl),
          sitioUrl: this.sanitizeUrl(this.videojocActual.sitioUrl)
        };
        const method = this.isEditing ? 'PUT' : 'POST';
        const url = this.isEditing
          ? `http://localhost:3005/api/videojocs/${this.videojocActual._id}`
          : 'http://localhost:3005/api/videojocs';
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.user.token}`
          },
          body: JSON.stringify(videojocToSave)
        });
        if (!response.ok) throw new Error('Error al guardar videojuego');
        const videojoc = await response.json();
        if (this.isEditing) {
          const index = this.videojocs.findIndex(v => v._id === videojoc._id);
          if (index !== -1) this.videojocs.splice(index, 1, videojoc);
        } else {
          this.videojocs.push(videojoc);
        }
        this.resetFormulari();
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
    },
    editarVideojoc(videojoc) {
      if (!this.isAdmin) return;
      this.videojocActual = { ...videojoc };
      this.isEditing = true;
    },
    async eliminarVideojoc(id) {
      if (!this.isAdmin) return;
      if (!confirm('¿Seguro que quieres eliminar este videojuego?')) return;
      try {
        const response = await fetch(`http://localhost:3005/api/videojocs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.user.token}` }
        });
        if (!response.ok) throw new Error('Error al eliminar videojuego');
        this.videojocs = this.videojocs.filter(v => v._id !== id);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
    },
    visitarSitio(url) {
      window.open(url, '_blank');
    },
    resetFormulari() {
      this.videojocActual = { _id: null, nombre: '', imagenUrl: '', descripcion: '', sitioUrl: '' };
      this.isEditing = false;
    },
    checkSession() {
      console.log('CheckSession iniciado');
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');
      console.log('Token y rol desde localStorage:', { token, rol });
      if (token && rol) {
        this.user = { token, rol };
        console.log('Sesión detectada, llamando a carregarVideojocs');
        this.carregarVideojocs();
      } else {
        this.user = null;
        this.videojocs = [];
        console.log('No hay sesión activa');
      }
    }
  },
  created() {
    console.log('Componente creado');
    this.checkSession();
  },
  template: `
    <div class="container">
      <nav class="navbar">
        <h1>Gestor de Videojuegos</h1>
        <div class="nav-links">
          <button v-if="!isLoggedIn" @click="showLogin = true">Iniciar Sesión</button>
          <button v-if="!isLoggedIn" @click="showRegister = true">Registrarse</button>
          <span v-if="isLoggedIn">Bienvenido, {{ user.rol }}</span>
          <button v-if="isLoggedIn" @click="logout">Cerrar Sesión</button>
        </div>
      </nav>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="showLogin" class="modal">
        <div class="modal-content">
          <h2>Iniciar Sesión</h2>
          <form @submit.prevent="login">
            <div class="form-group">
              <label>Email</label>
              <input v-model="loginData.email" required placeholder="Ej: usuario@ejemplo.com">
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="loginData.password" type="password" required placeholder="Contraseña">
            </div>
            <button type="submit">Iniciar Sesión</button>
            <button type="button" @click="showLogin = false">Cancelar</button>
          </form>
        </div>
      </div>

      <div v-if="showRegister" class="modal">
        <div class="modal-content">
          <h2>Registrarse</h2>
          <form @submit.prevent="register">
            <div class="form-group">
              <label>Email</label>
              <input v-model="registerData.email" required placeholder="Ej: usuario@ejemplo.com">
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="registerData.password" type="password" required placeholder="Contraseña">
            </div>
            <button type="submit">Registrarse</button>
            <button type="button" @click="showRegister = false">Cancelar</button>
          </form>
        </div>
      </div>

      <div v-if="isLoggedIn" class="main-content">
        <div v-if="isAdmin" class="form-container">
          <h2>{{ isEditing ? 'Editar Videojuego' : 'Añadir Videojuego' }}</h2>
          <form @submit.prevent="guardarVideojoc">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="videojocActual.nombre" required placeholder="Ej: Elden Ring">
            </div>
            <div class="form-group">
              <label>URL de la Imagen</label>
              <input v-model="videojocActual.imagenUrl" required placeholder="Ej: https://example.com/image.jpg">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="videojocActual.descripcion" required placeholder="Describe el videojuego"></textarea>
            </div>
            <div class="form-group">
              <label>URL del Sitio</label>
              <input v-model="videojocActual.sitioUrl" required placeholder="Ej: https://www.eldenring.com">
            </div>
            <button type="submit">{{ isEditing ? 'Actualizar' : 'Añadir' }}</button>
            <button type="button" v-if="isEditing" @click="resetFormulari">Cancelar</button>
          </form>
        </div>

        <div class="form-container">
          <h2>Lista de Videojuegos</h2>
          <div class="videojocs-grid">
            <div v-for="videojoc in sanitizedVideojocs" :key="videojoc._id" class="videojoc-card" @click="visitarSitio(videojoc.sitioUrl)">
              <img :src="videojoc.imagenUrl" :alt="videojoc.nombre" class="videojoc-image" @error="handleImageError($event)">
              <h3>{{ videojoc.nombre }}</h3>
              <p>{{ videojoc.descripcion }}</p>
              <div v-if="isAdmin" class="actions">
                <button @click.stop="editarVideojoc(videojoc)">Editar</button>
                <button @click.stop="eliminarVideojoc(videojoc._id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="welcome">
        <h2 class="welcome-title">¡Bienvenido al Gestor de Videojuegos!</h2>
        <p class="welcome-text">Explora y gestiona tu colección de videojuegos. Regístrate o inicia sesión para comenzar.</p>
        <div class="carousel">
          <div class="carousel-item">
            <img src="https://assets.xboxservices.com/assets/35/74/3574d987-14ad-4b2b-9a22-1af38e170c0d.jpg?n=Elden-Ring_Sneaky-Slider-1084_Shadow-of-Erdtree-Launch_1600x675_01.jpg" alt="Elden Ring" class="carousel-image">
            <div class="game-overlay">
              <h3>Elden Ring</h3>
              <p>Un épico RPG de mundo abierto lleno de aventuras.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img src="https://cdn1.epicgames.com/offer/77f2b98e2cef40c8a7437518bf420e47/EGS_Cyberpunk2077_CDPROJEKTRED_S1_03_2560x1440-359e77d3cd0a40aebf3bbc130d14c5c7" alt="Cyberpunk 2077" class="carousel-image">
            <div class="game-overlay">
              <h3>Cyberpunk 2077</h3>
              <p>Explora Night City en este RPG futurista.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img src="https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb5cf8f725e329d3194920c0c0b64f" alt="The Witcher 3" class="carousel-image">
            <div class="game-overlay">
              <h3>The Witcher 3</h3>
              <p>Caza monstruos en un mundo de fantasía épica.</p>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button @click="showLogin = true">Iniciar Sesión</button>
          <button @click="showRegister = true">Registrarse</button>
        </div>
      </div>
    </div>
  `
});