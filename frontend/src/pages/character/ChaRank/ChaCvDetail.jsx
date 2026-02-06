import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Calendar, User, Activity, Building2, Globe, Twitter, Film, Image as ImageIcon } from "lucide-react";
import CharacterList from "./CharacterList";

const ChaCvDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cvData, setCvData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        // 주소를 /api/cv/${id} 로 정확히 수정합니다.
        fetch(`/api/cv/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("데이터를 불러올 수 없습니다.");
                return res.json();
            })
            .then((data) => {
                setCvData(data);
                setLikesCount(data.likes || 0);
            })
            .catch((err) => {
                console.error("백엔드 데이터 로딩 실패:", err);
                // 에러 발생 시 로딩 상태를 해제하기 위해 null 처리 혹은 에러 핸들링
            });
    }, [id]);

    if (!cvData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg font-bold text-slate-400">Loading...</div>
            </div>
        );
    }

    const toggleLike = () => {
        // 좋아요 기능은 추후 백엔드 PUT/POST API와 연결 필요
        if (isLiked) {
            setLikesCount(prev => prev - 1);
        } else {
            setLikesCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
                        <ArrowLeft size={20} />
                        <span>뒤로가기</span>
                    </button>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight hidden md:block">성우 프로필</h2>
                    <div className="w-24"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50 sticky top-24">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                                    {/* Entity의 image 필드 사용 */}
                                    <img
                                        src={cvData.image || "/images/no-image.png"}
                                        alt={cvData.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {e.target.src = "/images/no-image.png"}}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">{cvData.name}</h3>

                                <button
                                    onClick={toggleLike}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all mt-4 shadow-sm
                                ${isLiked
                                        ? 'bg-pink-50 text-pink-500 border border-pink-100'
                                        : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'}`}
                                >
                                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                    <span>{likesCount.toLocaleString()} Likes</span>
                                </button>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <Calendar size={16} /> 생년월일
                            </span>
                                    <span className="font-bold text-slate-700">
                                {cvData.birth || "정보 없음"}
                            </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <User size={16} /> 신장
                            </span>
                                    <span className="font-bold text-slate-700">
                                {cvData.height ? `${cvData.height}cm` : "정보 없음"}
                            </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <Activity size={16} /> 혈액형
                            </span>
                                    <span className="font-bold text-slate-700">
                                {cvData.bloodTypeDisplayName || "Unknown"}
                            </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="flex items-center gap-2 font-bold text-slate-500">
                                <Building2 size={16} /> 소속사
                            </span>
                                    <span className="font-bold text-slate-700">
                                {cvData.agency || "정보 없음"}
                            </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-50">
                            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
                                <ImageIcon className="text-primary" />
                                참여 작품 이미지
                            </h3>

                            {cvData.aniImages && cvData.aniImages.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {cvData.aniImages.map((src, idx) => (
                                        <div key={idx} className="w-24 h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-slate-100">
                                            <img
                                                src={src}
                                                alt="참여작품"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {e.target.src = "/images/no-image.png"}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <ImageIcon size={48} className="text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-bold">참여 작품 이미지가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChaCvDetail;