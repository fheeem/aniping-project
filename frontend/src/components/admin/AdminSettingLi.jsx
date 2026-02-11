import { UserX } from 'lucide-react';

const AdminSettingLi = ({realAdmin, index, handleClickRemoveAdmin }) => {

    const onDeleteAdmin = () => {
        if(confirm(`'${realAdmin.nickname}' 사용자의 운영자 권한을 해제하시겠습니까?`)){
            handleClickRemoveAdmin(realAdmin.id)
        }
    }

    return(
        <li className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors text-center">
            <div className="col-span-1 font-medium text-slate-500">{index + 1}</div>
            <div className="col-span-2 font-bold text-slate-700">{realAdmin.nickname}</div>
            <div className="col-span-2 text-slate-600">{realAdmin.name}</div>
            <div className="col-span-3 text-slate-500 text-sm truncate">{realAdmin.email}</div>
            <div className="col-span-2 text-slate-400 text-sm">{realAdmin.createAd}</div>
            <div className="col-span-2 flex items-center justify-center">
                <button 
                    onClick={onDeleteAdmin}
                    className="flex items-center gap-1.5 text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                >
                    <UserX size={16} />
                    권한 해제
                </button>
            </div>
        </li>
    )
}

export default AdminSettingLi;
