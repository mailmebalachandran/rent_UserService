const expect = require('chai').expect;
const request = require('supertest');
const User = require('../../models/User');
require('dotenv/config');

const app = require('../../app');
app.listen(process.env.TESTING_PORT);
console.log("Listening to the port : " + process.env.TESTING_PORT);
let token;

let firstUser = {
    FirstName:"Balachandran",
    MiddleName:"",
    LastName: "Kanagasundaram",
    PhoneNumber: "9894130966",
    EmailId: "mailme.balachandran@gmail.com",
    UserName: "bala",
    Password: "nullvoid",
    CreatedBy : "Admin"
}

let defaultUser = {
        FirstName:"Geetha",
        MiddleName:"",
        LastName: "Balachandran",
        PhoneNumber: "7358529473",
        EmailId: "bgeetha2514@gmail.com",
        UserName: "geetha",
        Password: "nullvoid"
}
let updatedUser = {
    _id: "",
    FirstName:"Geetha1",
    MiddleName:"",
    LastName: "Balachandran2",
    PhoneNumber: "7358529473",
    EmailId: "bgeetha2514@gmail.com",
    UserName: "geetha",
    Password: "nullvoid"
}

let saveUserId;

describe('POST /user', () =>{
    before(async () => {
        const userData = new User(firstUser);
        await userData.save();
    })

    after(async () => {
        await User.deleteOne({EmailId: 'mailme.balachandran@gmail.com'});
    })

    // it('Get User with invalid authorization', function(done) {
    //     request(app)
    //         .get('/userService/getUsers')
    //         .set('authorization', 'bearer ' +token)
    //         .then((res) => {
    //             const body = res.body;
    //             expect(body).to.contain.property('message');
    //             done();
    //         })
    //         .catch((err) => {done(err);});
    // });

    it('Authenticate User ', (done) => { 
        request(app)
            .post('/userService/authenticateUser')
            .send({ UserName: "bala", Password: "nullvoid" })
            .then((res) => {
                const body = res.body;
                token = body.access_token;
                expect(body).to.contain.property('access_token');
                expect(body).to.contain.property('refresh_token');
                done();  
            })
    });

    it('Creating a new user', function(done) {
        try
        {
        request(app)
            .post('/userService/saveUser') 
            .set('authorization', 'bearer ' + token)
            .send(defaultUser)
            .then((res) => {
                const body = res.body;
                console.log(body);
                saveUserId = body._id;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('FirstName');
                expect(body).to.contain.property('MiddleName');
                expect(body).to.contain.property('LastName');
                expect(body).to.contain.property('PhoneNumber');
                expect(body).to.contain.property('EmailId');
                expect(body).to.contain.property('UserName');
                expect(body).to.contain.property('Password');
                done();
            })
        }
        catch(err){
        }
            
    });

    it('User Name already exists', function(done) {
        request(app).post('/userService/saveUser') 
            .send(defaultUser)
            .set('authorization', 'bearer ' +token)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('message');
                done();
            })
            .catch((err) => {done(err);});
            
    });

    it('Update User', function(done) {
        updatedUser._id = saveUserId;
        request(app)
            .put('/userService/updateUser') 
            .set('authorization', 'bearer ' + token)
            .send(updatedUser)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('FirstName');
                expect(body).to.contain.property('MiddleName');
                expect(body).to.contain.property('LastName');
                expect(body).to.contain.property('PhoneNumber');
                expect(body).to.contain.property('EmailId');
                expect(body).to.contain.property('UserName');
                expect(body).to.contain.property('Password');
                done();
            })
            .catch((err) => {done(err);});
            
    });

    it('Delete User', function(done) {
        request(app)
            .delete('/userService/deleteUser') 
            .send({"_id": saveUserId})
            .set('authorization', 'bearer ' +token)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('deletedCount').to.eql(1);
                expect(body).to.contain.property('ok').to.eql(1);
                done();
            })
            .catch((err) => {done(err);});
    });

    it('Get User after all test case passed', function(done) {
        request(app)
            .get('/userService/getUsers')
            .set('authorization', 'bearer ' +token)
            .then((res) => {
                const body = res.body;
                expect(body).to.be.an('array').to.have.length.to.greaterThan(0);
                done();
            })
            .catch((err) => {done(err);});
    });

});