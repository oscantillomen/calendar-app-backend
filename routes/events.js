/* 
    Event Routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validateJWT');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateFields } = require('./../middlewares/field-validatos');
const { isDate } = require('./../helpers/isDate');

const router = Router();

router.use(validateJWT);

router.get('/', getEvents);

router.post(
	'/',
	[
		check('title', 'Title is required').notEmpty(),
		check('start', 'Initial date is required').custom(isDate),
		check('end', 'Ending date is required').custom(isDate),
		validateFields
	],
	createEvent
);

router.put(
	'/:id',
	[
		check('title', 'Title is required').notEmpty(),
		check('start', 'Initial date is required').custom(isDate),
		check('end', 'Ending date is required').custom(isDate),
		validateFields
	],
	updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;
