const mongoose = require('mongoose');
const app = require('../app');
const Student = require('../api/models/student');
const Educator = require('../api/models/educator');
const Course = require('../api/models/course');
const request = require('supertest');
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

beforeAll(async () => {
    const testDbUrl = 'mongodb+srv://Group16:Group16@cluster0.vfhbrkw.mongodb.net/Test_Common_Ground?retryWrites=true&w=majority';
    await mongoose.disconnect();
    await mongoose.connect(testDbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
}, 10000);

beforeEach(async () => {
    // await Student.deleteMany();
});

afterAll(async () => {
    // delete all collections
    await mongoose.disconnect();
});

describe('Section Controller - createSection', () => {
    it('should create a new section', async () => {
        const educator1 = {
            email: 'testeducator@example.com',
            password: 'testPassword',
        }
        const educator = await Educator.findOne({email: 'testeducator@example.com'}).exec();

        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const res1 = await request(app)
            .post(`/educator/create-section/${educator.courseCreated[0]}`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'testSection',
            })

        expect(res1.statusCode).to.equal(201);
        expect(res1.body.message).to.equal('Section created');
    });
    it('should not create a new section if course does not exist', async () => {
        const educator1 = {
            email: 'testeducator@example.com',
            password: 'testPassword',
        }
        const educator = await Educator.findOne({email: 'testeducator@example.com'}).exec();

        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const res1 = await request(app)
            .post(`/educator/create-section/123456789012345678901234`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'testSection',
            })

        expect(res1.statusCode).to.equal(404);
        expect(res1.body.message).to.equal('Course not found');
    });
    it('should not create a new section if user is not the creator of the course', async () => {
        const educator1 = {
            email: 'testeduc1ator@example.com',
            password: 'testPassword',
        };

        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const educator = await Educator.findOne({email: 'testeducator@example.com'}).exec();

        const res1 = await request(app)
            .post(`/educator/create-section/${educator.courseCreated[0]}`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'testSection',
            })

        expect(res1.statusCode).to.equal(401);
        expect(res1.body.message).to.equal('Unauthorized');
    });
});

describe('Section Controller - editSection', () => {
    it('should edit a section', async () => {
        const educator1 = {
            email: 'testeducator@example.com',
            password: 'testPassword',
        };
        const educator = await Educator.findOne({email: 'testeducator@example.com'}).populate('courseCreated').exec();
        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const res1 = await request(app)
            .patch(`/educator/edit-section/${educator.courseCreated[0]._id}/${educator.courseCreated[0].courseSections[0]._id}`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'editedSection',
            })

        expect(res1.statusCode).to.equal(201);
        expect(res1.body.message).to.equal('Section edited');
        expect(res1.body).to.have.property('section');
    });
    it('should not edit a section if course does not exist', async () => {
        const educator1 = {
            email: 'testeducator@example.com',
            password: 'testPassword',
        };

        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const res1 = await request(app)
            .patch(`/educator/edit-section/123456789012345678901234/123456789012345678901234`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'editedSection',
            })

        expect(res1.statusCode).to.equal(404);
        expect(res1.body.message).to.equal('Course not found');
    });
    it('should not edit if section does not exist', async () => {
        const educator1 = {
            email: 'testeducator@example.com',
            password: 'testPassword',
        };

        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const educator = await Educator.findOne({email: 'testeducator@example.com'}).populate('courseCreated').exec();
        const res1 = await request(app)
            .patch(`/educator/edit-section/${educator.courseCreated[0]._id}/123456789012345678901234`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'editedSection',
            })

        expect(res1.statusCode).to.equal(404);
        expect(res1.body.message).to.equal('Section not found');
    });
    it('should not edit a section if user is not the creator of the course', async () => {
        const educator1 = {
            email: 'testeduc1ator@example.com',
            password: 'testPassword',
        };

        const res = await request(app)
            .post('/educator/login')
            .send(educator1)

        const educator = await Educator.findOne({email: 'testeducator@example.com'}).populate('courseCreated').exec();
        const res1 = await request(app)
            .patch(`/educator/edit-section/${educator.courseCreated[0]._id}/${educator.courseCreated[0].courseSections[0]._id}`)
            .set('Authorization', 'Bearer ' + res.body.token)
            .send({
                title: 'editedSection',
            })

        expect(res1.statusCode).to.equal(401);
        expect(res1.body.message).to.equal('Unauthorized');
    });
});
