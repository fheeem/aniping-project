import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import "./AniInfo.css";

const AniInfo=()=>{
    const {id}=useParams();
    const [anime,setAnime]=useState(null)
    const [likes,setLikes]=useState(0);
    const [saved,setSaved]=useState(false);

    useEffect(()=>{
        fetch("/data/animeInfoData.json")
        .then((res)=>res.json())
        .then((data)=>{
            const found=data.find((item)=>item.id===Number(id));
            setAnime(found);
            if(found){
                setLikes(found.likes||0); //초기 좋아요 값
                setSaved(found.save||false); //초기 찜 상태
            }
        })
        .catch((err)=>console.error("데이터 불러오기 실패",err));
    },[id]);

    if(!anime)return<p>로딩중...</p>;
    //s
    const handleLike=()=>{
        setLikes(likes+1)
    };

    const handleSave=()=>{
        setSaved(!saved);
    };

    return(
        <div className="aniInfo">
            <img src={anime.infoImg} alt={anime.title} className="aniInfoImage"/>
            <div className="aniInfoDetails">
                <h2>{anime.title}</h2>
                <p><strong>감독:</strong>{anime.director}</p>
                <p><strong>제작사:</strong>{anime.studio}</p>
                <p><strong>장르:</strong>{anime.genre}</p>
                <p><strong>방영일:</strong>{anime.airDate}</p>
                <p><strong>등급:</strong>{anime.rating}</p>
                
                <div className="aniInfoAction"> {/*좋아요 다시 누르면 취소되게 */}
                    <button className="likeBtn" onClick={handleLike}>
                        ❤️ {likes}
                    </button>
                    <button className="saveBtn" onClick={handleSave}>
                        {saved? "☆즐겨찾기 등록":"⭐즐겨찾기 해제"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AniInfo;
