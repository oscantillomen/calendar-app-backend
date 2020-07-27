/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validateFields } = require('./../middlewares/field-validatos');
const { validateJWT } = require('../middlewares/validateJWT');

const { createUser, loginUser, renewToken } = require('../controllers/auth');

// Rutas
router.post(
	'/new',
	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
	],
	createUser
);

router.post(
	'/',
	[
		check('email', 'El email es obligatorio').notEmpty(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
	],
	loginUser
);

router.get('/renew', validateJWT, renewToken);


module.exports = router;
