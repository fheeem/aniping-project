import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from 'lucide-react';

const AdminAniLi = ({ani, onDelete}) => {
    const navigate = useNavigate();

    const handleLiClick = () => {
        navigate(`/AdminAniLiEd/${ani.id}`)
    }

    const handleDelete = (e) => {
        e.stopPropagation(); // 부모 li의 클릭 이벤트 전파 방지
        if (confirm(`'${ani.title}' 항목을 정말 삭제하시겠습니까?`)) {
            onDelete(); // 부모 컴포넌트에서 전달받은 삭제 함수 실행
        }
    }

    return(
        <li 
            className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors cursor-pointer text-left"
            onClick={handleLiClick}
        >
            <div className="col-span-1 text-center font-medium text-slate-500">{ani.id}</div>
            <div className="col-span-4 font-bold text-slate-800 truncate">{ani.title}</div>
            <div className="col-span-2 text-slate-600">{ani.genre || ani.category}</div>
            <div className="col-span-2 text-slate-500">{ani.director}</div>
            <div className="col-span-1 text-center text-slate-500">{ani.episodes || '-'}</div>
            <div className="col-span-2 flex items-center justify-center gap-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/AdminAni/edit/${ani.id}`); }}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                    <Edit size={14} />
                    수정
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                    title="삭제"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    )
}

export default AdminAniLi;
