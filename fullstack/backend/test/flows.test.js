const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/index');
const db = require('../src/db');

describe('API flows', function() {
  before(function() {
    // ensure normalized tables exist
    require('../src/migrations/normalize-1-create-normalized-tables')();
    require('../src/migrations/normalize-2-migrate-data')();
  });

  it('logs in with demo user and gets token', async function() {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin', role: 'admin' });
    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.have.nested.property('data.token');
    const token = res.body.data.token;
    expect(token).to.match(/^demo-/);
  });

  it('creates a waiting patient and accepts it', async function() {
    // login to get token
    const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin', role: 'admin' });
    const token = login.body && login.body.data && login.body.data.token;

    // create a waiting entry
    const uniqueDni = `TEST-${Date.now()}`;
    const newPatient = {
      nombre: 'Test',
      apellido: 'Paciente',
      dni: uniqueDni,
      edad: 30,
      toEspera: true
    };

    const created = await request(app)
      .post('/api/pacientes/espera')
      .set('Authorization', `Bearer ${token}`)
      .send(newPatient);

    expect(created.status).to.be.oneOf([200, 201, 400]);
    if (created.status === 400) throw new Error('Create espera failed: ' + JSON.stringify(created.body));
    expect(created.body).to.have.nested.property('data.id');
    const esperaId = created.body.data.id;

    // accept the waiting entry
    const accept = await request(app)
      .post(`/api/pacientes/espera/${esperaId}/accept`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(accept.status).to.be.oneOf([200,201]);
    expect(accept.body).to.have.nested.property('data.id');
    // verify patient exists in pacientes table (search by DNI)
    const paciente = db.prepare('SELECT json FROM pacientes WHERE json LIKE ?').get(`%${uniqueDni}%`);
    expect(paciente).to.exist;
  });
});
