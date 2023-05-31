const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', function(req, res) {
  let { email, name, password, dateOfBirth } = req.body
 // name=name.trim()
 //  email = email.trim();
 //  password = password.trim();
 //  dateOfBirth = dateOfBirth.trim();

  if (email === "" || name === "" || password === "" || dateOfBirth === "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields"
    });
  } else if (!/^[a-zA-Z]*/.test(  name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered"
    });
  } 
  else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Short password entered"
    });
  } else {
    User.find({ email })
      .then(result => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "User already exists"
          });
        } else {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then(hashedPassword => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                dateOfBirth
              });
              newUser
                .save()
                .then(result => {
                  res.json({
                    status: "SUCCESS",
                    message: "Signup successful",
                    data: result
                  });
                })
                .catch(() => {
                  res.json({
                    status: "FAILED",
                    message: "An error occurred while saving the user"
                  });
                });
            })
            .catch(() => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing the password"
              });
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking the user"
        });
      });
  }
});

router.post('/login', (req, res) => {
    let{email,password}=req.body
    //  email = email.trim();
    // password = password.trim();
    if(email ==="" || password ===""){
        res.json({
            status:"FAILED",
            message:"Empty credentials supplied"
        })
    }
    else{
        User.find({email})
        .then((data)=>{
            if(data.length){
                const hashedPassword=data[0].password
                bcrypt.compare(password,hashedPassword)
                .then((result)=>{
                    if(result){
                        res.json({
                            status:"SUCCESS",
                            message:"Login successful",
                            data:data
                        })
                    }
                    else{
                        res.json({
                            status:"FAILED",
                            message:"Invalid password entered"
                        })
                    }
                })
                .catch(()=>{
                    res.json({
                        status:"FAILED",
                        message:"An error occurred while comparing passwords"
                    })
                })
            }
            else{
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials entered"
                })
            }
        })
        .catch(()=>{
            res.json({
                status:"FAILED",
                message:"An error occurred while checking for the user"
            })
        })
    }
});

module.exports = router;
