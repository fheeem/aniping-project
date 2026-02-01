import { useState } from 'react';

const likeBtn = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const heartStyle = {
    color: isLiked ? 'red' : 'gray',
    cursor: 'pointer',
    fontSize: '24px',
  };
  return { isLiked, handleLikeClick, heartStyle };
};

export default likeBtn;
