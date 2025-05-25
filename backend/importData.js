const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const Videojoc = require('./models/Videojoc');

const mongoURI = 'mongodb://localhost:27017/gestor-videojocs';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

const importarDatos = async () => {
  try {
    // Limpiar colecciones existentes
    await Usuario.deleteMany({});
    await Videojoc.deleteMany({});
    console.log('Colecciones limpiadas');

    // Insertar usuarios proporcionados
    const usuarios = [
      {
        _id: '68296fb3f682111343133ab0',
        email: 'moussaboudhafri@gmail.com',
        password: '$2b$10$gvubOYX9IyN6N8y0bXSy/OwFzZ/Vumcks8PAE.aGAjN7oZyW/Ffm2',
        rol: 'cliente',
        __v: 0
      },
      {
        _id: '682970d3f682111343133aba',
        email: 'moussadmin@gmail.com',
        password: '$2b$10$3HfIpijRtvwRFOArw.I5F.upFzqVkgXWvic./l4YQ/ypFIWYUjxki',
        rol: 'admin',
        __v: 0
      }
    ];

    await Usuario.insertMany(usuarios);
    console.log('Usuarios importados correctamente');

    // Insertar videojuegos proporcionados
    const videojocs = [
      {
        _id: '682961b1b19698cdb6b8b563',
        nombre: 'Agario',
        imagenUrl: 'https://imgs.crazygames.com/agario/20230719092731/agario-cover?metadata=none&quality=40&width=1200&height=630&fit=crop',
        descripcion: 'Un juego en el que puedes comer o ser comido',
        sitioUrl: 'https://agar.io/',
        __v: 0
      },
      {
        _id: '6829725cf682111343133ac4',
        nombre: 'slither.io',
        imagenUrl: 'https://slitheriogame.io/upload/imgs/options/slither-io-game-large.jpg',
        descripcion: 'Hazte invencible y atrapa a todas las demas serpientes',
        sitioUrl: 'https://slither.io',
        __v: 0
      },
      {
        _id: '6829772e8d0725f7f7b73c34',
        nombre: 'Elden Ring',
        imagenUrl: 'https://image.api.playstation.com/vulcan/img/rnd/202111/0506/hcFeWRVGHYK72uOw6Mn6f4Ms.jpg',
        descripcion: 'El mejor juego de fantasia que existe',
        sitioUrl: 'https://es.bandainamcoent.eu/elden-ring/elden-ring',
        __v: 0
      },
      {
        _id: '682977f48d0725f7f7b73c3c',
        nombre: 'Cyberpunk',
        imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiqlFwgcAUwtUrlnG_mXKyP46PjhRX1qWTFg&s',
        descripcion: 'Juego con buena historia y una estética única',
        sitioUrl: 'https://cyberpunk.net',
        __v: 0
      },
      {
        _id: '682978418d0725f7f7b73c3f',
        nombre: 'The Witcher 3',
        imagenUrl: 'https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb5cf8f725e329d3194920c0c0b64f',
        descripcion: 'Uno de los mejores juegos de la historia ahora mismo',
        sitioUrl: 'https://thewitcher.com',
        __v: 0
      }
    ];

    await Videojoc.insertMany(videojocs);
    console.log('Videojuegos importados correctamente');

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al importar datos:', error);
  } finally {
    mongoose.connection.close();
  }
};

importarDatos();