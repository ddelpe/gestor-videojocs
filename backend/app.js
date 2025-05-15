const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));