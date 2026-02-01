import React, { useState } from 'react';
import "./AniDetail.css";
import { AniCha, AniComment, AniInfo, AniPv, AniTag } from "../../components/anime";
import Comment from "../../components/common/comment"; // Comment 컴포넌트 import

const AniDetail = () => {
  // 1. 댓글 상태와 입력값을 관리하는 state를 추가합니다.
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // 2. 댓글 추가 함수를 정의합니다.
  const onAddComment = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    if (!commentText.trim()) {
      return; // 입력값이 비어있으면 함수 종료
    }

    const newComment = {
      id: Date.now(), // 고유 ID 생성
      author: "익명", // 실제로는 로그인한 사용자 이름으로 대체 가능
      text: commentText,
      time: new Date().toLocaleTimeString(), // 현재 시간
    };

    setComments([...comments, newComment]); // 기존 댓글 배열에 새 댓글 추가
    setCommentText(""); // 입력 필드 초기화
  };

  // 3. 댓글 삭제 함수를 정의합니다.
  const onDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };
  const handleDeleteComment = (commentId) => {
    const userConfirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
    if (userConfirmed) {
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
      alert('댓글이 삭제되었습니다.');
    }
  }
  return (
    <div className="ani-detail-container">
      <div className="ani-section-card">
        <AniInfo />
      </div>
      
      <div className="ani-section-card">
        <h3 className="ani-detail-title">등장인물</h3>
        <AniCha />
      </div>

      <div className="ani-section-card">
        <h3 className="ani-detail-title">PV / 예고편</h3>
        <AniPv />
      </div>

      <div className="ani-section-card">
        <h3 className="ani-detail-title">태그 정보</h3>
        <AniTag />
      </div>

      <div className="ani-section-card">
        <h3 className="ani-detail-title">댓글</h3>
        <Comment
          comments={comments}
          onAddComment={onAddComment}
          commentText={commentText}
          setCommentText={setCommentText}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
};

export default AniDetail;