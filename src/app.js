const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const morgan = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const { sequelize } = require('./config/database');
const routes = require('./routes');
const apiRoutes = require('./routes/api');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const { attachLocals } = require('./middleware/locals');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

sessionStore.sync();

app.use(flash());
app.use(attachLocals);

// JSON REST API for mobile clients (JWT-authenticated)
app.use('/api/v1', apiRoutes);

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
