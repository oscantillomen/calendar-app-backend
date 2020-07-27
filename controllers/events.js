const Event = require('./../models/Event');

const getEvents = async (req, res) => {
	const events = await Event.find().populate('user', 'name');

	res.json({
		ok: true,
		events
	});
};

const createEvent = async (req, res) => {
	const event = Event(req.body);

	try {
		event.user = req.uid;
		const savedEvent = await event.save();

		res.json({
			ok: true,
			event: savedEvent
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			ok: false,
			msg: 'Contacte al administrador'
		});
	}
};
const updateEvent = async (req, res) => {
	const eventId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			res.status(404).json({
				ok: false,
				msg: 'Event doesn´t exist'
			});
		}

		if (event.user.toString() !== uid) {
			res.status(401).json({
				ok: false,
				msg: 'No tiene permisos para editar este evento'
			});
		}

		const newEvent = {
			...req.body,
			user: uid
		};

		const updatedEvent = await Event.findByIdAndUpdate(event.id, newEvent, { new: true });

		res.json({
			ok: true,
			event: updatedEvent
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Contacte al administrador'
		});
	}
};

const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    
    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event doest´t exist'
            });
        }
    
        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para eliminar este evento'
            });
        }
    
        await Event.findByIdAndDelete(eventId);
    
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }
	
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent
};
