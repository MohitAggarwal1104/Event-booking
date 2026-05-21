import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://eventbook-login-service.onrender.com/api/auth/google/callback"
          : "http://localhost:5000/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;

        const name = profile.displayName;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            provider: "google"
          });
        }

        done(null, user);

      } catch (err) {

        done(err, null);

      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {

    const user = await User.findById(id);

    done(null, user);

  } catch (err) {

    done(err, null);

  }
});

export default passport;
