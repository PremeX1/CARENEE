const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const bcrypt = require('bcrypt');

const port = 3000

const db = require('./sql/sql')

const TOKEN_SECRET = "LADL:SKDL:SAKDL:SKDL:SKDLSKDA:LDKA:LSKD:";

app.use(express.json({ limit: "100mb" }));


function generateAccessToken(id) {
  const accessToken = jwt.sign( {name: id}, TOKEN_SECRET, { expiresIn: 0});
  return accessToken
}

app.get('/profile', async (req, res) => {
  console.log("REQEUST IN PROFILE")
  try {
    db.getStudentInfo(req.query.id, (result) => {
      try {
        if(result[0].std_id !== null)  {
          res.status(200).json({ result });
        } else {
          res.status(403).json({ code: '1', message: 'error' });
        }
      } catch (err) {
        res.status(403).json({ code: '0', message: 'error' });
      }
    })
    
  } catch (err) {
    res.status(400).json({ code: '0', message: 'error' });
  }
})

app.get('/getNotificate', async (req, res) => {
  try {
    db.getNotificate(req.query.id, (result) => {
      try {
        if(result[0].std_id !== null)  {
          res.status(200).json({ result });
        } else {
          res.status(403).json({ code: '1', message: 'error' });
        }
      } catch (err) {
        res.status(403).json({ code: '0', message: 'error' });
      }
    })
    
  } catch (err) {
    res.status(400).json({ code: '0', message: 'error' });
  }
})

app.get('/getRequestByID', async (req, res) => {
  try {
    db.getRequestByID(req.query.id, (result) => {
      try {
        if(result[0].std_id !== null)  {
          res.status(200).json({ result });
        } else {
          res.status(403).json({ code: '1', message: 'error' });
        }
      } catch (err) {
        res.status(403).json({ code: '0', message: 'error' });
      }
    })
    
  } catch (err) {
    res.status(400).json({ code: '0', message: 'error' });
  }
})

app.get('/getGradeStudent', async (req, res) => {
  console.log("REQEUST IN STUDENT")
  try {
    db.getGradeStudent(req.query.id, (result) => {
      try {
        if(result[0].std_id !== null)  {
          res.status(200).json({ result });
        } else {
          res.status(403).json({ code: '1', message: 'error' });
        }
      } catch (err) {
        res.status(403).json({ code: '0', message: err });
      }
    })
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ code: '0', message: err });
  }
})

app.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body
    // bcrypt.hash(password, 10).then((hashPassword) => {
      // console.log(hashPassword)
    // })  
    db.getStudentInfo(id, (result) => {
      try {
        // console.log(result[0].password)
        bcrypt.compare(password, result[0].password).then((vaild) => {
          if (vaild) {
            console.log(req.body);
            res.status(200).json({ code: 'SUCCESS', id: req.body.id, token: generateAccessToken(id)});
          } else {
            res.status(403).json({ code: '1', message: 'error' });
          }
        })
      } catch (e) {
        res.status(403).json({ code: '0' });
        console.log(req.body)
      }

    })
  } catch (err) {
    console.log(err);
    res.status(403).json({ code: 'Failed' });
  }
})

app.post('/request_t', async (req, res) => {
  const data = req.body
  console.log(data)
  try {
    db.addRequest( data, (result) => {
      res.status(200).json(result);
    })
  } catch (error) {
    res.status(403).json({ error });
  }
});

app.listen(port, () => {
  console.log(`${port}`)
})