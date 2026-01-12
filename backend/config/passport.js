import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.js";

const BASE_URL =
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8000}`;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First try to find user by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If no user by googleId, try find by email (user may have registered previously)
          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              // Link the googleId to existing user and mark logged in/verified
              user.googleId = profile.id;
              user.isLoggedIn = true;
              user.isVerified = true;
              user.avatar =
                user.avatar ||
                (profile.photos &&
                  profile.photos[0] &&
                  profile.photos[0].value);
              await user.save();
            }
          }

          // If still no user, create a new one
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email:
                profile.emails && profile.emails[0] && profile.emails[0].value,
              avatar:
                profile.photos && profile.photos[0] && profile.photos[0].value,
              isLoggedIn: true,
              isVerified: true,
            });
          }
        } else {
          // ensure flags are up-to-date
          user.isLoggedIn = true;
          user.isVerified = true;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
