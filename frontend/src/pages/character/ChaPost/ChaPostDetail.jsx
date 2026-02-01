import likeBtn from '../../../components/common/postBtn';
import Comment from '../../../components/common/comment';
import ChaPostBtn from './ChaPostBtn';
import ChaPdItem from './ChaPdItem';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const ChaPostDetail = ({ posts, setPosts }) => {
  const { id } = useParams();
  const post = posts.find((item) => item.id === Number(id));
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim() === '') {
      return;
    }
    const newComment = {
      id: Date.now(),
      text: commentText,
      postId: post.id,
      author: '익명',
      time: new Date().toLocaleString(),
    };
    setComments([...comments, newComment]);
    setCommentText('');
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
  };
  
  const handleDelete = () => {
    const userConfirmed = window.confirm(
      '정말로 이 게시글을 삭제 하시겠습니까?'
    );
    if (userConfirmed) {
      try {
        const updatedPosts = posts.filter((p) => p.id.toString() !== id);
        setPosts(updatedPosts);
        alert('게시글이 삭제되었습니다.');
        navigate('/chaPost');
      } catch (e) {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };
  const { handleLikeClick, heartStyle } = likeBtn();

  if (!post) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-400">게시글을 찾을 수 없습니다.</h2>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-primary font-bold mb-8 transition-colors">
            <ChevronLeft size={20} />
            Back to List
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50/50 overflow-hidden p-8 md:p-12">
            <ChaPdItem post={post} />
            
            <div className="my-12 border-t border-slate-100"></div>

            <ChaPostBtn
                id={id}
                handleLikeClick={handleLikeClick}
                heartStyle={heartStyle}
                onDelete={handleDelete}
            />

            <div className="mt-12 bg-slate-50 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Comments ({comments.length})</h3>
                <Comment
                    postId={post.id}
                    comments={comments}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                />
            </div>
        </div>
      </div>
    </div>
  );
};
export default ChaPostDetail;
