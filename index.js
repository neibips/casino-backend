const app = require('./app')
const mongoose = require('mongoose')

async function startDB () {
    await mongoose.connect('mongodb+srv://admin:admin@casinoghost.0s9watd.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,

        keepAlive: true,

    }).then(() => {
        console.log('database successful connected')
    })
}

mongoose.connection.on('error', err => {
    console.log(err);
});

const PORT =  4000

const server = app.listen(PORT, () => {
    startDB()
    console.log(`App running on port ${PORT}...`);
});
