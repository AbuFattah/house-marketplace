import React, { useRef } from "react";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { auth } from "../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const emailRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(emailRef.current.value)) {
      toast.error("Invalid Email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, emailRef.current.value);
      toast.success("Reset Link Sent");
    } catch (error) {
      if (error.message.includes("user-not-found")) {
        toast.error("Email not found");
        return;
      }
      toast.error("Failed to send reset link");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input ref={emailRef} type="email" className="emailInput" />
          <Link className="forgotPasswordLink" to="/signin">
            Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
