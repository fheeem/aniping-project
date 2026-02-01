import React from 'react';
import { User, Heart, FileText, MessageSquare, HelpCircle } from 'lucide-react';

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'info', label: '내 정보', icon: <User size={20} /> },
    { id: 'likes', label: '찜 목록', icon: <Heart size={20} /> },
    { id: 'posts', label: '내가 쓴 글', icon: <FileText size={20} /> },
    { id: 'lines', label: '내가 쓴 대사', icon: <MessageSquare size={20} /> },
    { id: 'inquiry', label: '문의사항', icon: <HelpCircle size={20} /> },
  ];

  const handleClick = (tabId) => {
    console.log('UserSidebar: Button clicked, setting activeTab to', tabId);
    setActiveTab(tabId);
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden h-fit">
      <div className="p-6 border-b border-blue-50 bg-blue-50/30">
        <h2 className="text-xl font-black text-slate-800">My Page</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">나의 활동 내역을 확인하세요</p>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${activeTab === item.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
