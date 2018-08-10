var express = require("express")
var bodyParser = require("body-parser")
var mongodb = require("mongodb")
var ObjectID = mongodb.ObjectID
var Verify = require('./VerifyToken')
var PIECES = "pieces"
var USERS = "users"

var history = require('connect-history-api-fallback')
var jwt = require('jsonwebtoken')
var config = require('./config')
var bcrypt = require('bcryptjs')
var app = express()
app.use(history())
app.use(bodyParser.json())

var distDir = __dirname + "/dist/"
app.use(express.static(distDir))

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT, function () {
    var port = server.address().port
    console.log("App now running on port", port)
  });
});

// Get pieces
app.get('/api/vault', Verify, (req, res) => {
  db.collection(PIECES).find({'user': req.userId}).toArray((err, pieces) => {
    if (err) {
      console.log('Error getting pieces', err)
    } else {
      res.status(200).json(pieces)
    }
  })
})
// Get single piece
app.get('/api/vault/:id', Verify, (req, res) => {
  db.collection(PIECES).findOne({'_id': ObjectID(req.params.id)}, (err, piece) => {
    if (err) {
      console.log('Error finding single piece')
    } else {
      res.status(200).json(piece)
    }
  })
})
// Add Piece
app.post('/api/vault', Verify, (req, res) => {
  // req.body.user = ObjectID(req.userId)
  req.body.user = req.userId
  var newPiece = req.body
  console.log('')
  console.log('Adding new piece', newPiece)
  db.collection(PIECES).insertOne(newPiece, (err, piece) => {
    if (err) {
      console.log('Error adding ', req.body.title)
      res.send(err)
    } else {
      res.status(200).json(piece)
    }
  })
})

// Update piece
app.put('/api/vault/:id', Verify, (req, res) => {
  db.collection(PIECES).updateOne({'_id': ObjectID(req.params.id)}, 
    { $set: {
      'title': req.body.title,
      'composer': req.body.composer,
      'opera': req.body.opera,
      'language': req.body.language,
      'genre': req.body.genre,
      'status': req.body.status,
      'location': req.body.location }}, (err, piece) => {
    if (err) {
      console.log('Error updating', req.body.title)
    } else {
      res.status(200).json(piece)
    }
  })
})
// Delete piece
app.delete('/api/vault/:id', Verify, (req, res) => {
  // db.collection(PIECES).deleteOne({'_id': ObjectID(req.params.id)}, (err, piece) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     res.status(200)
  //   }
  // })
  try {
    db.collection(PIECES).deleteOne(
      { "_id": ObjectID(req.params.id)}
    )
  } catch (e) {
    console.log(e)
  }
})
/*

    AUTH

*/
app.post('/api/register', (req, res) => {
  db.collection(USERS).findOne({'username': req.body.username}, (error, existingUser) => {
    if (error) res.status(500)
    if (existingUser) {
      res.status(409).send('Error Registering: Username already exists')
    } else {
      var hashedPass = bcrypt.hashSync(req.body.password, 8)

      db.collection(USERS).insertOne({
        'username': req.body.username,
        'email': req.body.email,
        'password': hashedPass
      }, (err, user) => {
        if (err) return res.status(500)
        if (!user) console.log('User dne ' , user)
        else {
          var _id = user.insertedId.valueOf()
          console.log('_id: ', _id)
          var token = jwt.sign({ id: _id}, config.secret, {
            expiresIn: 86400
          })
          res.status(200).send({auth: true, user: req.body.username, userId: user._id, token: token})
        }
      })
    }
  })
})

app.post('/api/login', (req, res) => {
  db.collection(USERS).findOne({'username': req.body.username}, (err, user) => {
    if (err) { return res.status(500).send('Error on Server') }
    if (!user) { return res.status(404).send('User not found') }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) {
      return res.status(401).send({auth: false, token:null})
    } else {
      var token = jwt.sign({ id: user._id}, config.secret, {
        expiresIn: 86400
      })
      return res.status(200).send({auth: true, user: req.body.username, userId: user._id, token: token})
    }
  })
})

app.get('/api/me', Verify, (req, res, next) => {
  var id = ObjectID(req.userId)
  db.collection(USERS).findOne({'_id': id}, (err, user) => {
    if (err) {
      console.log('Error getting user info', err)
    } 
    else if (!user) {
        res.status(404).send('Nobody logged in')
    } else {
        res.status(200).json({username: user.username})
    }
  })
})

app.post('/api/logout', (req, res) => {
  res.status(200).send({auth: false, token: null})
})


