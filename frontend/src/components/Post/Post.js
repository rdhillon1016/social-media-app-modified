import React, { useState } from 'react';
import GeneralPostContainer from '../GeneralPostContainer/GeneralPostContainer';
import ImageSlideshow from '../ImageSlideshow/ImageSlideshow';
import styles from './Post.module.css';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import CommentsSection from './CommentsSection/CommentsSection';

const Post = props => {
    const [ commentsExpanded, setCommentsExpanded ] = useState(false);

    const isOwner = true;
    const { post } = props;
    const { description, profilePicUrl, user, timestamp, numLikes, numComments } = props.post;

    const toggleComments = () => {
        setCommentsExpanded(!commentsExpanded);
    }

    return (
    <div className={styles['post-container']}>
        <GeneralPostContainer isOwner={isOwner} timestamp={timestamp}>
            <div className={styles['post-text']}>
                <span>{description}</span>
            </div>
        </GeneralPostContainer>
        <div className={styles['slideshow-container']}>
            <ImageSlideshow />
        </div>
        <div className={styles['additional-info-container']}>
            <div className={styles['post-info-container']}>
                <button className={styles['post-info-button']}>{numLikes} likes</button>
                <button className={styles['post-info-button']}><HiOutlineThumbUp className={styles['post-info-icon']} /> Like</button>
                <button className={styles['post-info-button']} onClick={toggleComments}>{numComments} comments</button>
            </div>
            { commentsExpanded ? <CommentsSection /> : null }
        </div>
    </div>
    )
};

export default Post;