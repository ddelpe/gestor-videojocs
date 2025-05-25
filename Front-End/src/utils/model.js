// src/utils/model.js
// src/utils/model.js
const Model = {
  async login(loginData) {
    try {
      console.log('Intentando iniciar sesión con:', loginData);
      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      console.log('Respuesta del login:', response.status, response.statusText);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
      console.log('Token recibido:', data.token, 'Rol:', data.rol);
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      return { token: data.token, rol: data.rol };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  async register(registerData) {
    try {
      console.log('Registrando usuario:', registerData);
      const response = await fetch('/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrarse');
      }
      return true;
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  },
  async fetchVideojocs(token) {
    try {
      console.log('Enviando solicitud a /api/videojocs con token:', token);
      const response = await fetch('/api/videojocs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Respuesta de /api/videojocs:', response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error de la API:', errorData);
        if (errorData.error === 'Token inválido') {
          throw new Error('Sesión expirada');
        }
        throw new Error(errorData.error || 'Error al cargar videojuegos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en fetchVideojocs:', error);
      throw error;
    }
  },
  async saveVideojoc(videojoc, isEditing, token) {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/videojocs/${videojoc._id}` : '/api/videojocs';
      console.log('Guardando videojuego:', { method, url, videojoc, token });
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(videojoc),
      });
      console.log('Respuesta de saveVideojoc:', response.status, response.statusText);
      let savedVideojoc;
      try {
        savedVideojoc = await response.json();
        console.log('Videojuego devuelto:', savedVideojoc);
      } catch (jsonError) {
        console.error('Error al parsear la respuesta JSON:', jsonError);
        throw new Error(`Error al parsear la respuesta del servidor (Estado: ${response.status})`);
      }
      if (!response.ok) {
        throw new Error(savedVideojoc.error || `Error al guardar videojuego (Estado: ${response.status})`);
      }
      if (!savedVideojoc._id) {
        console.warn('Advertencia: El videojuego devuelto no contiene _id:', savedVideojoc);
      }
      return savedVideojoc;
    } catch (error) {
      console.error('Error en saveVideojoc:', error);
      throw error;
    }
  },
  async deleteVideojoc(id, token) {
    try {
      console.log('Eliminando videojuego con ID:', id, 'Token:', token);
      const response = await fetch(`/api/videojocs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Respuesta de /api/videojocs/', id, ':', response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al eliminar videojuego (Estado: ${response.status})`);
      }
      return true;
    } catch (error) {
      console.error('Error en deleteVideojoc:', error);
      throw error;
    }
  },
  getSession() {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    console.log('Token y rol desde localStorage:', { token, rol });
    return token && rol ? { token, rol } : null;
  },
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  },
};

export default Model;