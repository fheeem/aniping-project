import React from 'react';
import './Comment.css';

const Comment = ({
  comments,
  onAddComment,
  commentText,
  setCommentText,
  onDeleteComment,
}) => {
  return (
    <div className="comment">
      <h3>댓글</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="commentItem">
          <div className="commentContent">
            <div className="commentMeta">
              <p className="commentAuthor">{comment.author}</p>
              <p className="commentTime">{comment.time}</p>
            </div>
            <p className="commentText">{comment.text}</p>
          </div>
          <div className="commentBtn">
            <button
              className="commentDeleteBtn"
              onClick={() => onDeleteComment(comment.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
      <form onSubmit={onAddComment} className="commentForm">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <p>
          <button type="submit">등록</button>
        </p>
      </form>
    </div>
  );
};

export default Comment;
