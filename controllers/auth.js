const { response } = require('express');
const User = require('./../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				ok: false,
				msg: 'Ya existe un usuario con este email registrado'
			});
		}

		user = new User(req.body);

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		// Generar JWT
		const token = await generateJWT(user.id, user.name);

		res.status(201).json({
			ok: true,
			uid: user.id,
			name: user.name,
			token
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			ok: false,
			msg: 'Por favor contactar al administrador'
		});
	}
};

const loginUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: 'Email incorrecto'
			});
		}

		// Confirmar password
		const validPassword = bcrypt.compareSync(password, user.password);

		if (!validPassword) {
			return res.json({
				ok: false,
				msg: 'Password Incorrecto'
			});
		}

		// Generar JWT
		const token = await generateJWT(user.id, user.name);

		res.json({
			ok: true,
			uid: user.id,
			name: user.name,
			token
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			ok: false,
			msg: 'Por favor contactar al administrador'
		});
	}
};

const renewToken = async (req, res = response) => {
	const { uid, name } = req;

	const token = await generateJWT(uid, name);

	res.json({
		ok: true,
		token
	});
};

module.exports = {
	createUser,
	loginUser,
	renewToken
};
