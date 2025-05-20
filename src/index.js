const app = require('./app');
const db = require('./models');
const dotenv = require('dotenv');

dotenv.config();

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});


const PORT = process.env.PORT || 4000;

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
        app.listen(PORT, (error) => {
            if (error) {
                return console.error("Error: ", error);
            }
            console.log(`Listening on port ${PORT}`);
            return app;
        })
    })
    .catch((error) => { console.log('Unable to connect to the database:', error); });