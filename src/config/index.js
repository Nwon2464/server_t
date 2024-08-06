const passport = require("passport");
const chalk = require("chalk");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
<<<<<<< Updated upstream
const Users = require("../models/user");
passport.serializeUser((user, done) => { done(null, user.id); });

// // // browser sends the cookie back and received the id
passport.deserializeUser((id, done) => { Users.findById(id).then((user) => { done(null, user); }); });
passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK,
},
                                (accessToken, refreshToken, profile, done) => {
                                    // console.log(profile);
                                    //   return null;
                                    // console.log(profile);
                                    try {
                                        Users
                                            .findOne({
                                                googleId : profile.id,
                                            })
                                            .then((currentUser) => {
                                                if (currentUser) {
                                                    // already have user
                                                    console.log("already have user");
                                                    done(null, currentUser);
                                                } else {
                                                    // if not, create user in our db
                                                    new Users({
                                                        googleId : profile.id,
                                                        googleImage : profile._json.picture,
                                                        displayName : profile.displayName,
                                                        googleEmail : profile._json.email,
                                                    })
                                                        .save()
                                                        .then((newUser) => {
                                                            console.log("New data saved in MONGODB", newUser);
                                                            done(null, newUser);
                                                        });
                                                }
                                            });
                                    } catch (error) {
                                        throw new Error();
                                    }
                                }));
=======
// const Users = require("../models/user");

const { createUser, findUserByGoogleId } = require('../models/user');
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// // // browser sends the cookie back and received the id
passport.deserializeUser((id, done) => {
  Users.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
   async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      //   return null;
      // console.log(profile);
      try {
        let user = await findUserByGoogleId(profile.id);
        console.log(user,"LOGGING USER???");

        if (!user) {
          user = await createUser({
            googleId: profile.id,
            googleImage: profile.photos[0].value,
            displayName: profile.displayName,
            googleEmail: profile.emails[0].value,
          });
        }
        return done(null, user);
        // Users.findOne({
        //   googleId: profile.id,
        // }).then((currentUser) => {
        //   if (currentUser) {
        //     //already have user
        //     console.log("already have user");
        //     done(null, currentUser);
        //   } else {
        //     // if not, create user in our db
        //     new Users({
        //       googleId: profile.id,
        //       googleImage: profile._json.picture,
        //       displayName: profile.displayName,
        //       googleEmail: profile._json.email,
        //     })
        //       .save()
        //       .then((newUser) => {
        //         console.log("New data saved in MONGODB", newUser);
        //         done(null, newUser);
        //       });
        //   }
        // });
      } catch (error) {
        throw new Error();
      }
    }
  )
);
>>>>>>> Stashed changes
