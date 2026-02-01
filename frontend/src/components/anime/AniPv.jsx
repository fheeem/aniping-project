import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AniPv.css";

const AniPv = () => {
  const { id } = useParams();
  const [pvData, setPvData] = useState(null);

  useEffect(() => {
    fetch("/data/animePvData.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.animeId === Number(id));
        setPvData(found);
      })
      .catch((err) => console.error("PV 데이터 불러오기 실패:", err));
  }, [id]);

  if (!pvData) return <p>줄거리와 PV를 불러오는 중...</p>;

  // YouTube embed 링크로 변환
  const getEmbedUrl = (url) => {
    const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };
  return (
    <div className="aniPv">
      <h2>줄거리</h2>
      <p className="story">{pvData.story}</p>
      <h2>PV 영상</h2>
      <div className="pvVideo">
        <iframe
          width="100%"
          height="450"
          src={getEmbedUrl(pvData.pvUrl)}
          title="PV 영상"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default AniPv;
