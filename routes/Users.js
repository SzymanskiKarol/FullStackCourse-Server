const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware')
const { sign } = require('jsonwebtoken')

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hashed) => {
        Users.create({
            username: username,
            password: hashed
        })
        res.json("Success")
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // znajdz w db Users użytkownika gdzie username jest taki jak username którym sie teraz logujemy
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
        // porównuje hasło z loginu z hasłem zahashowanym pobranym z bazy 
        bcrypt.compare(password, user.password).then((match) => {
            if (match) {
                const accessToken = sign({ username: user.username, id: user.id }, "secret");
                res.json({ token: accessToken, username: username, id: user.id });
            } else {
                res.json({ error: "Wrong username or password" });
            }
        });
    } else {
        res.json({ error: "User does not exist" });
    }
})

router.get('/validate', validateToken, (req, res) => {
    res.json(req.user)

})

router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;
    // pobierz dane z Users o id = id z wykluczeniem pola password
    const basicInfo = await Users.findByPk(id, { attributes: { exclude: ['password'] } });
    res.json(basicInfo);
})

router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) { res.json({ error: "Wrong Password Entered!" }) } else {


            bcrypt.hash(newPassword, 10).then((hash) => {
                Users.update(
                    { password: hash },
                    { where: { username: req.user.username } }
                );
                res.json("SUCCESS");
            });
        }
    });
});

module.exports = router;