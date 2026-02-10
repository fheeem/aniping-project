import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trophy } from "lucide-react";
import axios from "axios";

const ChaCvListItem = ({ cv }) => {
    const { rank, name, image, aniImages, likes = 0, id } = cv;
    const [localLikes, setLocalLikes] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);

    // 컴포넌트 로딩 시 이전에 좋아요를 눌렀는지 체크
    useEffect(() => {
        const likedStatus = localStorage.getItem(`liked_cv_${id}`);
        if (likedStatus === "true") {
            setIsLiked(true);
        }
    }, [id]);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentLikedStatus = isLiked; // 현재 상태 저장

        // UI 즉시 반영 (토글 로직)
        setIsLiked(!currentLikedStatus);
        setLocalLikes(prev => currentLikedStatus ? prev - 1 : prev + 1);

        // localStorage에 저장 (페이지 이동해도 유지되도록)
        if (!currentLikedStatus) {
            localStorage.setItem(`liked_cv_${id}`, "true");
        } else {
            localStorage.removeItem(`liked_cv_${id}`);
        }

        // 서버에 현재 상태를 보냄 (isLiked 파라미터 추가)
        axios.post(`http://localhost:8080/api/cv/like/${id}?isLiked=${currentLikedStatus}`)
            .catch((err) => {
                console.error(err);
                // 실패 시 롤백
                setIsLiked(currentLikedStatus);
                setLocalLikes(prev => currentLikedStatus ? prev + 1 : prev - 1);
                if (currentLikedStatus) {
                    localStorage.setItem(`liked_cv_${id}`, "true");
                } else {
                    localStorage.removeItem(`liked_cv_${id}`);
                }
            });
    };

    let rankColor = "text-slate-500";
    let rankIcon = null;

    if (rank === 1) {
        rankColor = "text-yellow-500";
        rankIcon = <Trophy size={16} className="fill-yellow-500 text-yellow-500" />;
    } else if (rank === 2) {
        rankColor = "text-slate-400";
        rankIcon = <Trophy size={16} className="fill-slate-400 text-slate-400" />;
    } else if (rank === 3) {
        rankColor = "text-amber-700";
        rankIcon = <Trophy size={16} className="fill-amber-700 text-amber-700" />;
    }

    return (
        <li className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-blue-50/30 transition-colors group">
            <div className={`col-span-1 flex flex-col items-center justify-center font-black text-xl ${rankColor}`}>
                {rank}
                {rankIcon}
            </div>

            <div className="col-span-3">
                <Link to={`/ChaCvDetail/${id}`} className="flex items-center gap-4 group/profile">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover/profile:scale-110 transition-transform shrink-0">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg group-hover/profile:text-primary transition-colors">{name}</h3>
                        <div
                            onClick={handleLike}
                            className="flex items-center gap-1 text-xs font-bold text-slate-400 mt-1 cursor-pointer"
                        >
                            <Heart
                                size={12}
                                className={`transition-colors ${isLiked ? 'fill-accent text-accent' : 'fill-slate-300 text-slate-300 group-hover/profile:fill-accent group-hover/profile:text-accent'}`}
                            />
                            {localLikes} Likes
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-span-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {aniImages?.map((src, idx) => (
                    <div key={idx} className="w-12 h-16 rounded-lg overflow-hidden border border-slate-100 shadow-sm shrink-0 hover:-translate-y-1 transition-transform">
                        <img src={src} alt="참여작품" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </li>
    );
};

export default ChaCvListItem;