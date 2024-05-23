const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const db = require('./models');
const configureMiddlewares = require('./middlewares/middlewares');


// middlewares
configureMiddlewares(app);


// router
const router = require('./routes/router');
app.use('/api', router);


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.log(err);
});