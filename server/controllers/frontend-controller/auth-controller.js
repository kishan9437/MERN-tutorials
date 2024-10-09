const User = require('../../models/user-model');
const bcrypt = require('bcryptjs');

const home = async (req, res) => {
    try {
        res.status(200).send('Welcome to world best series ...!');
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, phone, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const saltRound = 10;
        const hash_password = await bcrypt.hash(password, saltRound);

        const userCreate = await User.create({ username, email, phone, password: hash_password });
        res.status(201).json({
            msg: "Registration successful",
            token: await userCreate.generateToken(),
            userId: userCreate._id.toString()
        });
    } catch (error) {
        res.status(404).json('internel server error')
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const user = await bcrypt.compare(password, userExist.password)
        // const user = await userExist.comparePassword(password);
        if (user) {
            res.status(200).json({
                msg: "Login successful",
                token: await userExist.generateToken(),
                userId: userExist._id.toString()
            });
        } else {
            res.status(400).json({ message: 'Invalid Email and Password' });
        }
    } catch (error) {
        // res.status(404).json('Internel server error');
        next(error);
    }
}

const user = async (req, res) => {
    try {
        const userData = req.user;
        // console.log(userData);
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(`error from the user route ${error}`);
    }
}
module.exports = { home, register, login, user }