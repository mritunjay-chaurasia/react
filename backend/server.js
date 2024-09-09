const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./app/config/db.config");
const cors = require('cors');
const path = require('path');
const routes = require('./app/routes/index');
const http = require('http');
const app = express();
const server = http.createServer(app);
const multer = require('multer')
app.use(cors())
// parse requests of content-type - application/json
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = path.resolve("public", "grapesjsImages");
    cb(null, destination);
},
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage: storage })
app.post('/image', upload.single('file'), function (req, res) {
  res.json({})
})

exports.io = require('socket.io')(server, {
  pingTimeout: 30000,
  pingInterval: 25000,
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PATCH", "POST", "PUT"],
    credentials: true,
  },
  allowEIO3: false
});

//turning off query logs
sequelize.options.logging = false;

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.log('Error syncing database:', err);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });


app.use('/api', routes);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

require('./socket')