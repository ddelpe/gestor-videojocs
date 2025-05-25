const app = new Vue({
    el: '#app',
    data: ViewModel.state,
    methods: {
      sanitizeUrl: ViewModel.sanitizeUrl,
      handleImageError: ViewModel.handleImageError,
      login: ViewModel.login,
      register: ViewModel.register,
      logout: ViewModel.logout,
      carregarVideojocs: ViewModel.carregarVideojocs,
      guardarVideojoc: ViewModel.guardarVideojoc,
      editarVideojoc: ViewModel.editarVideojoc,
      eliminarVideojoc: ViewModel.eliminarVideojoc,
      visitarSitio: ViewModel.visitarSitio,
      resetFormulari: ViewModel.resetFormulari,
      isAdmin: ViewModel.isAdmin,
      isLoggedIn: ViewModel.isLoggedIn,
      getSanitizedVideojocs: ViewModel.getSanitizedVideojocs
    },
    created() {
      ViewModel.init();
    },
    template: `
      <div class="container">
        <nav class="navbar">
          <h1>Gestor de Videojuegos</h1>
          <div class="nav-links">
            <button v-if="!isLoggedIn()" @click="showLogin = true">Iniciar Sesión</button>
            <button v-if="!isLoggedIn()" @click="showRegister = true">Registrarse</button>
            <span v-if="isLoggedIn()">Bienvenido, {{ user.rol }}</span>
            <button v-if="isLoggedIn()" @click="logout">Cerrar Sesión</button>
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

        <div v-if="isLoggedIn()" class="main-content">
          <div v-if="isAdmin()" class="form-container">
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
              <div v-for="videojoc in getSanitizedVideojocs()" :key="videojoc._id" class="videojoc-card" @click="visitarSitio(videojoc.sitioUrl)">
                <img :src="videojoc.imagenUrl" :alt="videojoc.nombre" class="videojoc-image" @error="handleImageError($event)">
                <h3>{{ videojoc.nombre }}</h3>
                <p>{{ videojoc.descripcion }}</p>
                <div v-if="isAdmin()" class="actions">
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