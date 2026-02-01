import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AniCha.css";

const AniCha = () => {
  const { id } = useParams();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("/data/animeChaData.json") // 캐릭터 데이터 파일
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.animeId === Number(id));
        if (found) setCharacters(found.characters);
      })
      .catch((err) => console.error("캐릭터 데이터 불러오기 실패:", err));
  }, [id]);
  
  return (
    <div className="aniCha">
      <h2>등장인물</h2>
      <div className="aniChaList">
        {characters.map((cha, index) => (
          <div className="aniChaCard" key={index}>
            <img src={cha.image} alt={cha.nameKr} className="aniChaImage" />
            <div className="aniChaInfo">
              <p className="chaName">
                <strong>{cha.nameKr}</strong> ({cha.nameEn}) {cha.nameJp}
              </p>
              <p className="chaCv">
                <strong>CV:</strong> {cha.cvKr} ({cha.cvEn}) {cha.cvJp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AniCha;
