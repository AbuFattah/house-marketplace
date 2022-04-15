import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase.config";

const useAuthStatus = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("inside authstate");
        // console.log(user);
        setUser(user);
        setLoading(false);
      } else {
        setUser({});
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

export default useAuthStatus;
