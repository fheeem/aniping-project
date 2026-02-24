import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const AdminReport = () => {
  const [reportsPage, setReportsPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchReports = (currentPage = 0, currentStatus = '') => {
    setLoading(true);
    let url = `/api/admin/reports?page=${currentPage}&size=10`;
    if (currentStatus) {
        url += `&status=${currentStatus}`;
    }

    axios.get(url)
      .then(res => {
        setReportsPage(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load reports", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports(page, statusFilter);
  }, [page, statusFilter]);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setReplyContent('');
    } else {
      setExpandedId(id);
      // 기존 답변이 있으면 불러오기
      const report = reportsPage.content.find(r => r.id === id);
      setReplyContent(report.adminComment || '');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`상태를 ${getStatusText(newStatus)}로 변경하시겠습니까?`)) {
        axios.put(`/api/admin/reports/${id}`, { status: newStatus, adminComment: replyContent })
            .then(() => {
                alert("상태가 변경되었습니다.");
                fetchReports(page, statusFilter);
            })
            .catch(err => alert("상태 변경 실패"));
    }
  };

  const handleProcess = (id) => {
    if (window.confirm("신고를 처리 완료하시겠습니까? 대상 콘텐츠는 삭제됩니다.")) {
        axios.put(`/api/admin/reports/${id}`, { status: 'PROCESSED', adminComment: replyContent })
            .then(() => {
                alert("처리가 완료되었습니다.");
                fetchReports(page, statusFilter);
            })
            .catch(err => alert("처리 실패"));
    }
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

  const getStatusText = (status) => {
      switch (status) {
          case 'WAITING': return '대기';
          case 'PROCESSED': return '처리완료';
          case 'REJECTED': return '거절';
          default: return status;
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

  const renderPagination = () => {
    if (!reportsPage) return null;
    const { totalPages, number } = reportsPage;
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {pageNumbers.map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-10 h-10 rounded-full font-bold transition-colors ${
              p === number ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {p + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> 신고 관리
        </h3>
        <div className="flex gap-2">
            <select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="">전체 상태</option>
                <option value="WAITING">대기중</option>
                <option value="PROCESSED">처리완료</option>
                <option value="REJECTED">거절됨</option>
            </select>
        </div>
      </div>

      {loading ? (
          <div className="text-center py-10">로딩 중...</div>
      ) : (
        <div className="space-y-4">
            {reportsPage?.content.map((report) => (
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
                                        placeholder="처리 내용 또는 메모를 입력하세요..."
                                        className="w-full h-32 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                                    />
                                    <button 
                                        onClick={() => handleProcess(report.id)}
                                        className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
                                    >
                                        처리 내용 저장 및 완료 (대상 삭제)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            ))}
        </div>
      )}
      {renderPagination()}
    </div>
  );
};

export default AdminReport;
