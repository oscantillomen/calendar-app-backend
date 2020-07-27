const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('db online');
    } catch (err) {
        console.log(err);
        throw new Error('Error al inicializar base de datos');
    }
}

module.exports = {
    dbConnection
}