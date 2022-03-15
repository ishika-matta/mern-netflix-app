const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const listRoute = require('./routes/lists');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
})
.then(()=> console.log('Database connection successful'))
.catch((err) => console.log(err));

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/list', listRoute);

app.listen(8800, () => {
    console.log('backend server is running');
});