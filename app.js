const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

let users = [ {
    username: 'username',
    password: 'password'
}]

app.get('/users', (req,res) => {
    res.json(users);
})

app.post('/users', async (req,res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        console.log(req.body.password);
        console.log(salt);
        console.log(hashedPassword);

        const user = {
            username: req.body.username,
            password: hashedPassword
        }

        users.push(user);
        res.status(201).send();
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   
    // res.json("Added User Successfully");

})

app.get('/users/login', async (req,res) => {
    console.log('logging in....');
    const user = users.find( data => data.username === req.body.username)

    console.log(user.username)
    console.log(user.password)
    console.log(req.body.password)

    if (user == null) {
        return res.status(400).send("User not found");
    }

    try {
        if (await bcrypt.compare(req.body.password,user.password)) {
            res.send("Success");
        } else {
            res.send("Failed");
        }
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
})

app.listen(3000)