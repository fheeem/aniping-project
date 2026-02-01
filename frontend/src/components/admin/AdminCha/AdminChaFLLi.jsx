import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminChaFLLi = ({chaFl, onApprove, onReject, onDelete}) => {

    return(
        <li className="grid grid-cols-12 gap-4 p-5 items-center border-b border-slate-100 last:border-b-0">
            <div className="col-span-1 flex justify-center">
                <img src={chaFl.image} alt={chaFl.title} className="w-14 h-14 object-cover rounded-lg shadow-sm border border-slate-200"/>
            </div>
            <div className="col-span-3 font-bold text-slate-800 text-base truncate pr-4">{chaFl.title}</div>
            <div className="col-span-4 text-slate-600 text-base italic truncate pr-4">"{chaFl.content}"</div>
            <div className="col-span-1 text-center text-slate-500 text-sm">{chaFl.user}</div>
            <div className="col-span-1 text-center text-slate-400 text-sm">{chaFl.date}</div>
            <div className="col-span-2 flex items-center justify-center gap-2">
                {chaFl.status === 'registered' ? (
                    <>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full mr-2">
                            <CheckCircle size={12} /> 등록완료
                        </span>
                        <button 
                            onClick={onDelete}
                            className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                            title="삭제"
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full mr-2">
                            신청대기
                        </span>
                        <button 
                            onClick={onApprove}
                            className="p-2 text-slate-400 hover:bg-green-100 hover:text-green-600 rounded-full transition-colors"
                            title="승인"
                        >
                            <CheckCircle size={16} />
                        </button>
                        <button 
                            onClick={onReject}
                            className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                            title="거절"
                        >
                            <XCircle size={16} />
                        </button>
                    </>
                )}
            </div>
        </li>
    )
}

export default AdminChaFLLi;
