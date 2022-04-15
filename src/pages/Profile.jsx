import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { onAuthStateChanged, signOut, updateEmail } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";

const Profile = () => {
  const { user, loading } = useAuthStatus();
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
      if (user.displayName !== name) {
        await updateProfile(user, {
          displayName: name,
        });

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          name,
        });
      }
      if (user.email !== email) {
        await updateEmail(user, email);

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          email,
        });
      }
    } catch {
      toast.error("something went wrong");
    }
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
  if (loading) {
    return <p>Hello loader</p>;
  }

  console.log(user);
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
              disabled={!changeDetails}
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
