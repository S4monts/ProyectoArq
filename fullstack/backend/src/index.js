const express = require('express');
const cors = require('cors');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const ingresosRoutes = require('./routes/ingresos');
const encuentrosRoutes = require('./routes/encuentros');
const pacientesRoutes = require('./routes/pacientes');
const doctoresRoutes = require('./routes/doctores');
const historiasRoutes = require('./routes/historias');
const adminsRoutes = require('./routes/admins');

app.use('/api/auth', authRoutes);
app.use('/api/ingresos', ingresosRoutes);
app.use('/api/encuentros', encuentrosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/doctores', doctoresRoutes);
app.use('/api/historias', historiasRoutes);
app.use('/api/admins', adminsRoutes);

app.get('/', (req, res) => res.json({ ok: true, data: 'Medicor API' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Medicor backend running on http://localhost:${port}`));
