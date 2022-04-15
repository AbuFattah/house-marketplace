import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { email, password, name } = formData;

  const handleChange = (e) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const handleEmailBlur = (e) => {
    setEmailError("");
    if (email.length === 0) {
      setEmailError("Email required");
      return;
    }
    if (!/.+@.+\..+/.test(email)) {
      setEmailError("Invalid Email");
    }
  };

  const handlePasswordBlur = (e) => {
    setPasswordError("");
    if (password.length < 6) {
      setPasswordError("Password must be greater than 6");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // console.log({ user, authUser: auth.currentUser });
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formData.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      const path = location?.state?.from?.pathname || "/";
      navigate(path, { replace: true });
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form onSubmit={handleSubmit}>
          <input
            className="nameInput"
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
          />
          <input
            className="emailInput"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            required
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="passwordInput"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              required
            />
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password?
          </Link>

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button type="submit" className="signUpButton">
              <ArrowRightIcon
                fill="#fff"
                width="34px"
                height="34px"
              ></ArrowRightIcon>
            </button>
          </div>
        </form>

        {/* Google OAuth */}

        <Link to="/signin" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
};

export default SignUp;
