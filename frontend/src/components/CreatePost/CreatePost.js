import React, { useRef, useState } from "react";
import LargeTextInput from "../common/form/LargeTextInput/LargeTextInput";
import GeneralPostContainer from "../GeneralPostContainer/GeneralPostContainer";
import styles from "./CreatePost.module.css";
import CreatePostButton from "./CreatePostButton/CreatePostButton";
import { handleCreatePost } from "../../services/postService";
import PostImageSlideshow from "../PostImageSlideshow/PostImageSlideshow";
import AttachmentsBar from "./AttachmentsBar/AttachmentsBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getImageNum, getImages } from "../../test-data/imageMapping";

const CreatePost = (props) => {
  const { userId } = useParams();
  const [images, setImages] = useState([]);

  const handleImageUpload = () => {
    setImages(getImages(7));
  };

  const handleRemoveImage = (index) => {
    const imagesLength = images.length;

    setImages([
      ...images.slice(0, index),
      ...images.slice(index + 1, imagesLength),
    ]);
  };
  const textArea = useRef();
  const queryClient = useQueryClient();

  const createPost = (e) => {
    e.preventDefault();
    newPostMutation.mutate({
      message: textArea.current,
      event: e,
      images: getImageNum(images),
    });
    const val = e.target.querySelector("#textBox");
    val.textContent = "";
  };

  const newPostMutation = useMutation({
    mutationFn: ({ message, images }) => {
      handleCreatePost({ message, images }).then((res) => {
        return res.json();
      });
    },
    onSettled: (data, error, { event }) => {
      textArea.current = "";
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["posts", userId] });
        queryClient.invalidateQueries({ queryKey: ["homefeed"] });
      }, 250);
    },
  });

  return (
    <div className={styles["create-post-container"]}>
      <form
        onSubmit={(e) => {
          createPost(e);
          setImages([]);
        }}
      >
        <GeneralPostContainer props={props}>
          <LargeTextInput
            placeholder={"What would you like to say?"}
            value={textArea.current}
            onChange={(e) => {
              textArea.current = e.target.textContent;
            }}
          />
        </GeneralPostContainer>
        <div className={styles["slideshow-container"]}>
          <PostImageSlideshow
            images={images}
            handleRemoveImage={handleRemoveImage}
            editable
          />
        </div>
        <div className={styles["buttons-container"]}>
          <AttachmentsBar handleImageUpload={handleImageUpload} />
          <CreatePostButton />
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
