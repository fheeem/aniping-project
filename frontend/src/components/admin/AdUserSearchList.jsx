import { ShieldCheck, Trash2, UserPlus } from 'lucide-react';

const AdUserSearchList = ({ searchLi, index, handleClickDelete, handleClickRemoveAdmin}) => {

    const onDelete = () => {
        if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            handleClickDelete(searchLi.id)
        }
    }

    const onChangeAdmin = () => {
        if(!searchLi.admin){
            if(confirm(`${searchLi.userId} 사용자에게 운영자 권한을 부여하시겠습니까?`)){
                handleClickRemoveAdmin(searchLi.id);
            }
        }
    }

    return (
        <li className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors text-center">
            <div className="col-span-1 font-medium text-slate-500">{index + 1}</div>
            <div className="col-span-2 font-bold text-slate-700">{searchLi.userId}</div>
            <div className="col-span-2 text-slate-600">{searchLi.name}</div>
            <div className="col-span-3 text-slate-500 text-sm truncate">{searchLi.email}</div>
            <div className="col-span-2 text-slate-400 text-sm">{searchLi.startDate}</div>
            <div className="col-span-2 flex items-center justify-center gap-2">
                {searchLi.admin ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        <ShieldCheck size={16} />
                        운영자
                    </span>
                ) : (
                    <button 
                        onClick={onChangeAdmin} 
                        className="flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                        <UserPlus size={16} />
                        권한 부여
                    </button>
                )}
                <button 
                    onClick={onDelete}
                    className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                    title="사용자 삭제"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    )
}

export default AdUserSearchList;
