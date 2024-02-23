import React, { useRef } from "react";
import styles from "./ImageUploadButton.module.css";

const ImageUploadButton = (props) => {
  const { className, children, handleImageUpload } = props;

  return (
    <div>
      <button
        onClick={() => handleImageUpload()}
        className={className ? className : styles["upload-icon"]}
        type="button"
      >
        {children}
      </button>
    </div>
  );
};

export default ImageUploadButton;
