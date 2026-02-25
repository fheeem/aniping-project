import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const AdminReport = () => {
  // 목 데이터 (reports 테이블 구조 반영)
  const [reports, setReports] = useState([
    {
      id: 1,
      reporterId: 101,
      targetType: 'COMMENT',
      targetId: 505,
      reason: 'INSULT',
      content: '심한 욕설을 사용하여 불쾌감을 줍니다.',
      status: 'WAITING',
      adminId: null,
      createAt: '2024-05-20T10:30:00',
      updateAt: null
    },
    {
      id: 2,
      reporterId: 102,
      targetType: 'BOARD',
      targetId: 202,
      reason: 'SPAM',
      content: '같은 내용을 반복적으로 게시하고 있습니다.',
      status: 'PROCESSED',
      adminId: 1,
      createAt: '2024-05-19T15:20:00',
      updateAt: '2024-05-19T16:00:00'
    },
    {
      id: 3,
      reporterId: 103,
      targetType: 'LINE',
      targetId: 303,
      reason: 'SPOILER',
      content: '중요한 반전 내용을 포함하고 있습니다.',
      status: 'REJECTED',
      adminId: 1,
      createAt: '2024-05-18T09:00:00',
      updateAt: '2024-05-18T10:00:00'
    }
  ]);

  const [expandedId, setExpandedId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setReplyContent('');
    } else {
      setExpandedId(id);
      // 실제로는 여기서 상세 정보를 불러오거나 답변을 초기화할 수 있음
      setReplyContent('');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    // TODO: API 호출하여 상태 변경 (adminId도 함께 업데이트 필요)
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus, updateAt: new Date().toISOString() } : r));
  };

  const handleProcess = (id) => {
    // TODO: API 호출하여 처리 완료 (PROCESSED) 및 답변/조치 내용 저장
    // 현재 테이블 구조에는 답변 컬럼이 없으므로, 별도 로직이 필요하거나 테이블 수정이 필요할 수 있음.
    // 여기서는 상태만 변경하는 것으로 가정
    setReports(reports.map(r => r.id === id ? { ...r, status: 'PROCESSED', updateAt: new Date().toISOString() } : r));
    alert('처리가 완료되었습니다.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'WAITING':
        return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-yellow-100 text-yellow-600"><Clock size={12} /> 대기중</span>;
      case 'PROCESSED':
        return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-green-100 text-green-600"><CheckCircle size={12} /> 처리완료</span>;
      case 'REJECTED':
        return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-red-100 text-red-600"><XCircle size={12} /> 거절됨</span>;
      default:
        return null;
    }
  };

  const getReasonText = (reason) => {
    switch (reason) {
      case 'SPAM': return '스팸/도배';
      case 'INSULT': return '욕설/비방';
      case 'ADULT': return '음란물';
      case 'SPOILER': return '스포일러';
      case 'ETC': return '기타';
      default: return reason;
    }
  };

  const getTargetTypeText = (type) => {
    switch (type) {
      case 'BOARD': return '게시글';
      case 'COMMENT': return '댓글';
      case 'USER': return '사용자';
      case 'LINE': return '명대사';
      case 'CHARACTER': return '캐릭터';
      default: return type;
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> 신고 관리
        </h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="검색어 입력" 
            className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="p-2 bg-primary text-white rounded-xl">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden transition-all">
            {/* 헤더 */}
            <div 
                onClick={() => toggleExpand(report.id)}
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-slate-400 font-mono">#{report.id}</div>
                    <div className="col-span-2">{getStatusBadge(report.status)}</div>
                    <div className="col-span-2 font-bold text-slate-700">{getReasonText(report.reason)}</div>
                    <div className="col-span-3 text-sm text-slate-600">
                        <span className="font-bold text-slate-500 mr-1">[{getTargetTypeText(report.targetType)}]</span>
                        ID: {report.targetId}
                    </div>
                    <div className="col-span-2 text-sm text-slate-500">신고: {report.reporterId}</div>
                    <div className="col-span-2 text-sm text-slate-500 text-right">
                        {new Date(report.createAt).toLocaleDateString()}
                    </div>
                </div>
                <div className="ml-4">
                    {expandedId === report.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
            </div>

            {/* 확장 영역 */}
            {expandedId === report.id && (
                <div className="px-8 pb-8 pt-2 border-t border-slate-200 bg-white">
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <h5 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} /> 신고 상세 내용
                            </h5>
                            <div className="space-y-2 text-sm text-slate-700">
                                <p><span className="font-bold">신고 대상:</span> {getTargetTypeText(report.targetType)} (ID: {report.targetId})</p>
                                <p><span className="font-bold">신고 사유:</span> {getReasonText(report.reason)}</p>
                                <div className="mt-4 p-3 bg-white rounded-lg border border-red-100 text-slate-600 min-h-[100px]">
                                    {report.content}
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h5 className="font-bold text-primary mb-2">관리자 처리</h5>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleStatusChange(report.id, 'WAITING')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${report.status === 'WAITING' ? 'bg-yellow-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        대기
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(report.id, 'PROCESSED')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${report.status === 'PROCESSED' ? 'bg-green-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        처리완료
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(report.id, 'REJECTED')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${report.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        거절
                                    </button>
                                </div>
                                <textarea 
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="처리 내용 또는 메모를 입력하세요... (현재 DB 구조상 저장되지 않음)"
                                    className="w-full h-32 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                                />
                                <button 
                                    onClick={() => handleProcess(report.id)}
                                    className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
                                >
                                    처리 내용 저장 및 완료
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReport;
