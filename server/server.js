require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoute = require('./router/frontend-router/auth-router');
const contactRoute = require('./router/frontend-router/contact-router');
const serviceRoute = require('./router/frontend-router/service-router');
const adminRoute = require('./router/admin-router/router');
const connectDB = require('./config/db');
const errorMiddleware = require("./middlewares/error-middleware");

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET,POST,DELETE,PUT,PATCH,HEAD,OPTIONS",
    credentials:true,
}
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth', authRoute);
app.use('/api/form', contactRoute);
app.use('/api/data', serviceRoute);

app.use('/api/admin', adminRoute);

app.use(errorMiddleware);

const PORT = 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
