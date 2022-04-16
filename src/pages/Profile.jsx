import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { onAuthStateChanged, signOut, updateEmail } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";

const Profile = () => {
  const { user, loading } = useAuthStatus();
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const { name, email } = formData;

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  const onSubmit = async () => {
    if (!/.+@.+\..+/.test(email)) {
      toast.error("invalid email");
      return;
    }
    try {
      if (user.displayName !== name || user.email !== email) {
        setUpdating(true);
        await updateProfile(user, {
          displayName: name,
        });
        await updateEmail(user, email);

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          name,
          email,
        });
      }
    } catch {
      toast.error("something went wrong");
    }
    setUpdating(false);
    setChangeDetails((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      name: user?.displayName,
      email: user?.email,
    }));
  }, [user]);

  // ! DO NOT Run this loading code
  //! before useEffect at :line:60
  //! it will cause [rendered more hooks than during the preveious render]
  if (loading || updating) {
    return <Spinner />;
  }

  console.log(user);
  const emailDisabled = !(user?.providerData[0]?.providerId === "password");
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              if (!changeDetails) {
                setChangeDetails((prevState) => !prevState);
              }
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              name="name"
              className={changeDetails ? "profileNameActive" : "profileName"}
              disabled={!changeDetails}
              defaultValue={user?.displayName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              className={changeDetails ? "profileEmailActive" : "profileEmail"}
              disabled={emailDisabled}
              defaultValue={user?.email}
              onChange={handleChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
