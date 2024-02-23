import React from "react";
import styles from "./SignInWithPanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { googleSignIn } from "../../../services/authService";

const SignInWithPanel = () => {
  const fetchGoogleSignin = async () => {
    await googleSignIn();
  };

  return (
    <div className={styles["sign-in-with-container"]}>
      <button
        className={styles["sign-in-with"]}
        onClick={(e) => {
          e.preventDefault();
          fetchGoogleSignin();
        }}
      >
        <FontAwesomeIcon className={styles["icon-colour"]} icon={faGoogle} />
        Sign In With Google
      </button>
    </div>
  );
};

export default SignInWithPanel;
