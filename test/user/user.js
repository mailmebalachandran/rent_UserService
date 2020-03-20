const expect = require('chai').expect;
const request = require('supertest');
const User = require('../../models/User');

const app = require('../../app');
let token;

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
    before((done) => {
        User.remove({EmailId: "bgeetha2514@gmail.com"});
        done();
    })

    it('Authenticate User ', (done) => { 
        console.log("hitted Authenticate User");
        request(app)
                    .post('/userService/authenticateUser')
                    .send({ UserName: "balachandran", Password: "nullvoid" })
                    .then((res) => {
                        const body = res.body;
                        token = body.token;
                        done();  
                    })
    });

    it('OK, creating a new user', function(done) {
        try
        {
        request(app)
            .post('/userService/saveUser') 
            .set('authorization', 'bearer ' + token)
            .send(defaultUser)
            .then((res) => {
                const body = res.body;
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
            console.log(err);
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
        console.log(saveUserId);
        request(app)
            .put('/userService/updateUser') 
            .set('authorization', 'bearer ' + token)
            .send(updatedUser)
            .then((res) => {
                const body = res.body;
                console.log(body);
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
});