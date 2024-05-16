const express= require('express');
const userModel= require('./userSchema');
const mongoose= require('mongoose');
const session= require('express-session');
const mongoDbSession= require('connect-mongodb-session')(session)

const app= express();
const PORT=8000;
const MONGO_URI= `mongodb+srv://akashraviteja17:akash17@cluster0.fycw06z.mongodb.net/MayTestDB`;

const store= new mongoDbSession({
    uri: MONGO_URI,
    collection: "sessions"
})

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'This is may nodejs class', //used for ecrypting and decrypting of session data.
    resave: false,
    saveUninitialized: false,
    store: store
}))

mongoose.connect(MONGO_URI).then(()=>{
    console.log("Mongoose connected successfully")
}).catch((err)=>console.log(err));

app.get('/register-form', (req, res)=>{
    return res.send(`<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form action="/api/register" method="post">
            <label for="name">Name</label>
            <input type="text" name= "name"> <br>
            <label for="email">Email</label>
            <input type="email" name= "email"> <br>
            <label for="password">Password</label>
            <input type="password" name= "password"> <br>
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>`)
})

app.post('/api/register', async(req, res)=>{
    const namec= req.body.name;
    const emailc= req.body.email;
    const passwordc= req.body.password;

    const userObj= new userModel({
        name: namec,
        email: emailc,
        password: passwordc
    })

    try{
        const userDB= await userObj.save()
        return res.send({
            status: 200,
            message: 'Form submitted successfully',
            data: userDB
        })
    }
    catch(error){
        return res.send({
            status: 500,
            message: 'Database error',
            data:error
        })
    }

})

app.get('/login-form', (req, res)=>{
    return res.send(`<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form action="/api/login" method="post">
            <label for="email">Email</label>
            <input type="email" name= "email"> <br>
            <label for="password">Password</label>
            <input type="password" name= "password"> <br>
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>`)
})

app.post('/api/login', async(req, res)=>{
    console.log(req.body)
    const emailC= req.body.email;
    const passwordC= req.body.password;

    try{
        const db= await userModel.findOne({email: emailC}); //return the database object that we stored i.e, userObj
        if(!db){
            return res.send({
                status:400,
                message:"User not found, Please register"
            })
        }
        if(passwordC!=db.password){
            return res.send({
                status: 400,
                message: 'Incorrect password',
            })
        }

        console.log(req.session);

        return res.send({
            status: 200,
            message: 'Login success'
        })
    }
    catch(err){
        return res.send({
            status: 500,
            message: 'Data base error',
            error: err
        })
    }

})

app.listen(PORT, ()=>{
    console.log('Server running at PORT: 8000');
})