import React from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase.config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import googleIcon from "../assets/svg/googleIcon.svg";
import facebookIcon from "../assets/svg/facebookIcon.svg";
const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location?.state?.from?.pathname || "/";

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user.email);

      // check for user in firestore users collection
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // if no users found create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate(path, { replace: true });
      toast.success("Login Successful");
    } catch (error) {
      if (error.message.includes("account-exists-with-different-credential")) {
        toast.error("Email already in use");
        return;
      }
      toast.error("Login failed");
    }
  };

  const handleFacebookClick = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
      });
      navigate(path);
      toast.success("Login Successful");
    } catch (error) {
      if (error.message.includes("account-exists-with-different-credential")) {
        toast.error("Email already in use");
        return;
      }
      toast.error("Login failed");
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/signin" ? "In" : "Up"} with</p>

      <div style={{ display: "flex" }}>
        <button className="socialIconDiv" onClick={handleGoogleClick}>
          <img className="socialIconImg" src={googleIcon} alt="google" />
        </button>
        <button className="socialIconDiv" onClick={handleFacebookClick}>
          <img className="socialIconImg" src={facebookIcon} alt="google" />
        </button>
      </div>
    </div>
  );
};

export default OAuth;
