const mongoose = require('mongoose');
const app = require('../app');
const Student = require('../api/models/student');
const request = require('supertest');
const {expect} = require("chai");
const path = require('path');
const fs = require('fs');

beforeAll(async () => {
    const testDbUrl = 'mongodb+srv://Group16:Group16@cluster0.vfhbrkw.mongodb.net/Test_Common_Ground?retryWrites=true&w=majority';
    await mongoose.disconnect();
    await mongoose.connect(testDbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
});

beforeEach(async () => {
    // await Student.deleteMany();
});

afterAll(async () => {
    // delete all collections
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

