const express = require('express');
const cors = require('cors');

const citasRouter = require('./routes/citas');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/citas', citasRouter);

app.get('/', (req, res) => res.json({ ok: true, msg: 'API Medicor' }));

// Manejo básico de 404
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: 'No encontrado' });
});

module.exports = app;