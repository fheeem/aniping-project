import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Image, MessageSquare, User, ArrowLeft, Save } from 'lucide-react';

const ChaLineAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    anime: '',
    image: '', // 게시글 이미지 URL
    line: ''
  });

  // 로그인한 유저명 (임시로 고정)
  const author = "테스트유저"; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.anime || !formData.line) {
      alert("애니메이션 제목과 명대사는 필수 입력 항목입니다.");
      return;
    }

    const newLine = {
      id: Date.now(), // 임시 ID
      anime: formData.anime,
      line: formData.line,
      character: "미상", // 명대사 등록 시 캐릭터 이름은 입력받지 않으므로 임시값
      image: formData.image || "/images/no-image.png", // 이미지가 없으면 기본 이미지
      author: author,
      createdAt: new Date().toISOString()
    };

    console.log("새 명대사 등록:", newLine);
    alert("명대사가 성공적으로 등록되었습니다! (실제 DB 저장 로직 필요)");
    navigate('/chaLine'); // 등록 후 명대사 목록 페이지로 이동
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
      navigate('/chaLine');
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400";
  const labelClass = "block text-sm font-bold text-slate-600 mb-1 ml-1";

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-blue-50">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate('/chaLine')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span>목록으로</span>
          </button>
          <h2 className="text-3xl font-black text-slate-800">명대사 등록</h2>
          <div className="w-24"></div> {/* Space for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 애니메이션 제목 */}
          <div className="space-y-2">
            <label className={labelClass}>애니메이션 제목 <span className="text-red-500">*</span></label>
            <div className="relative">
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                name="anime"
                value={formData.anime}
                onChange={handleChange}
                placeholder="명대사가 나온 애니메이션 제목"
                className={inputClass}
              />
            </div>
          </div>

          {/* 게시글 이미지 URL */}
          <div className="space-y-2">
            <label className={labelClass}>장면 이미지 URL</label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="명대사 장면 이미지 URL (선택 사항)"
                className={inputClass}
              />
            </div>
          </div>

          {/* 명대사 입력 필드 */}
          <div className="space-y-2">
            <label className={labelClass}>명대사 <span className="text-red-500">*</span></label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 text-slate-400" size={20} />
              <textarea 
                name="line"
                value={formData.line}
                onChange={handleChange}
                placeholder="기억에 남는 명대사를 입력해주세요."
                rows="5"
                className={`${inputClass} pt-3 pb-3 resize-y`}
              ></textarea>
            </div>
          </div>

          {/* 작성자 (로그인 유저명 고정) */}
          <div className="space-y-2">
            <label className={labelClass}>작성자</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={author}
                readOnly
                className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={handleCancel} className="w-full bg-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-300 transition-all">
              취소하기
            </button>
            <button type="submit" className="w-full bg-primary text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChaLineAdd;
