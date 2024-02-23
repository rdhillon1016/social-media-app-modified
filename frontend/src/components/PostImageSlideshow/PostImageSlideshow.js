import React, { useState } from "react";
import styles from "./PostImageSlideshow.module.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "./Image/Image";

const PostImageSlideshow = (props) => {
  const { images, handlePostImageClick, editable, handleRemoveImage } = props;

  const [imageIndex, setImageIndex] = useState(0);

  const handleBackClick = (e) => {
    e.preventDefault();
    const newImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
    setImageIndex(newImageIndex);
  };

  const handleForwardClick = (e) => {
    e.preventDefault();
    const newImageIndex = (imageIndex + 1) % images.length;
    setImageIndex(newImageIndex);
  };

  return (
    <>
      {images.length > 1 ? (
        <span>
          {imageIndex + 1} of {images.length}
        </span>
      ) : null}
      <div className={styles["slideshow"]}>
        {images.length > 1 ? (
          <button className={styles["arrow"]} onClick={handleBackClick}>
            <IoIosArrowBack />
          </button>
        ) : null}
        {images.map((imageSrc, index) => {
          return (
            <Image
              handleRemove={(index) => {
                const newImageIndex =
                  images.length > 1 ? index % (images.length - 1) : 0;
                setImageIndex(newImageIndex);
                handleRemoveImage(index);
              }}
              editable={editable}
              key={index}
              index={index}
              imageSrc={imageSrc}
              currIndex={imageIndex}
              onClick={
                handlePostImageClick
                  ? (e) => {
                      e.preventDefault();
                      handlePostImageClick(images, index);
                    }
                  : undefined
              }
            />
          );
        })}
        {images.length > 1 ? (
          <button className={styles["arrow"]} onClick={handleForwardClick}>
            <IoIosArrowForward />
          </button>
        ) : null}
      </div>
    </>
  );
};

export default PostImageSlideshow;
