import { useNavigate } from "react-router-dom";
import { Edit, Trash2, FileText } from 'lucide-react';

const AdminVALi = ({ vCList, onDelete }) => {
    const navigate = useNavigate();

    const handleDetailClick = (e) => {
        e.stopPropagation();
        navigate(`/AdminVALiEd/${vCList.id}`);
    }

    const handleEditClick = (e) => {
        e.stopPropagation();
        navigate(`/Adedit/${vCList.id}`);
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm(`'${vCList.name}' 성우 정보를 정말 삭제하시겠습니까?`)) {
            onDelete();
        }
    }

    return (
        <li 
            className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors cursor-pointer text-left"
            onClick={handleDetailClick}
        >
            <div className="col-span-1 text-center font-bold text-lg text-slate-600">{vCList.rank}</div>
            <div className="col-span-3 flex items-center gap-4">
                <img src={vCList.image} alt={vCList.name} className="w-14 h-14 object-cover rounded-full shadow-sm"/>
                <span className="font-bold text-slate-800">{vCList.name}</span>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                {vCList.aniimage.slice(0, 5).map((vCLi, index) =>
                    <img key={index} src={vCLi} alt={vCList.name} className="w-10 h-14 object-cover rounded-md shadow-sm" title={`작품 ${index + 1}`} />
                )}
                {vCList.aniimage.length > 5 && <span className="text-sm text-slate-400 font-medium">...외 {vCList.aniimage.length - 5}개</span>}
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2">
                <button 
                    onClick={handleEditClick}
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

export default AdminVALi;
