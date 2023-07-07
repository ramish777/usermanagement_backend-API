const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/database');


const app = express();

const session = require('express-session');
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false
    })
);

//for rest api
app.use(bodyParser.json());
app.use((req, res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', ' GET, POST,PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers','CONTENT_TYPE','Authorization');
  next();
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const loginRoutes = require('./routes/login');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', loginRoutes);

app.listen(3002);