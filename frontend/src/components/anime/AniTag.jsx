import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import "./AniTag.css"

const AniTag=()=>{
    const {id}=useParams();
    const [tags,setTags]=useState([]);

    useEffect(()=>{
        fetch("/data/animeTagData.json")
        .then((res)=>res.json())
        .then((data)=>{
            const found =data.find((item)=>item.animeId===Number(id));
            if(found)setTags(found.tags.slice(0,10));
        })
        .catch((err)=>console.error("태그 데이터 불러오기 실패:",err));
    },[id]);

    if (tags.length===0) return null;


    return(
        <div className="aniTag">
            <h2>태그</h2>
            <div className="aniTagList">
                {tags.map((tag,index)=>(
                    <button key={index} className="aniTagBtn">
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default AniTag;