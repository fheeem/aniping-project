import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Image, User, ArrowLeft, Save } from 'lucide-react';

const ChaAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameKr: '',
    image: '', // 캐릭터 이미지 URL
    aniname: '' // 애니메이션 제목
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nameKr || !formData.aniname || !formData.image) {
      alert("캐릭터 이름, 애니메이션 제목, 이미지 URL은 필수 입력 항목입니다.");
      return;
    }

    const newCharacter = {
      id: Date.now(), // 임시 ID
      nameKr: formData.nameKr,
      image: formData.image,
      aniname: formData.aniname,
      likes: Math.floor(Math.random() * 100) + 1 // 임의의 좋아요 수
    };

    console.log("새 캐릭터 등록:", newCharacter);
    alert("캐릭터가 성공적으로 등록되었습니다! (실제 DB 저장 로직 필요)");
    navigate('/chaRankPage'); // 등록 후 캐릭터 랭킹 페이지로 이동
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
      navigate('/chaRankPage');
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400";
  const labelClass = "block text-sm font-bold text-slate-600 mb-1 ml-1";

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-blue-50">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate('/chaRankPage')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span>목록으로</span>
          </button>
          <h2 className="text-3xl font-black text-slate-800">캐릭터 등록</h2>
          <div className="w-24"></div> {/* Space for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 캐릭터 이름 */}
          <div className="space-y-2">
            <label className={labelClass}>캐릭터 이름 <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                name="nameKr"
                value={formData.nameKr}
                onChange={handleChange}
                placeholder="캐릭터 이름"
                className={inputClass}
              />
            </div>
          </div>

          {/* 애니메이션 제목 */}
          <div className="space-y-2">
            <label className={labelClass}>애니메이션 제목 <span className="text-red-500">*</span></label>
            <div className="relative">
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                name="aniname"
                value={formData.aniname}
                onChange={handleChange}
                placeholder="캐릭터가 등장하는 애니메이션 제목"
                className={inputClass}
              />
            </div>
          </div>

          {/* 이미지 URL */}
          <div className="space-y-2">
            <label className={labelClass}>캐릭터 이미지 URL <span className="text-red-500">*</span></label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="캐릭터 이미지 URL"
                className={inputClass}
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

export default ChaAdd;
