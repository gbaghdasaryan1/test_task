const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

chai.use(chaiHttp);
chai.should();

describe('API Tests', () => {
    let token;

    before(async () => {
        await User.deleteMany({});
        await Task.deleteMany({});
        const user = await User.create({ username: 'testuser', password: 'testpass' });
        token = chai.request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpass' });
    });

    it('should register a user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'newuser', password: 'newpass' })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it('should login and receive a token', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpass' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('should create a task', (done) => {
        chai.request(app)
            .post('/api/tasks')
            .set('Authorization', token)
            .send({ title: 'New Task' })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    after(async () => {
        await User.deleteMany({});
        await Task.deleteMany({});
    });
});
