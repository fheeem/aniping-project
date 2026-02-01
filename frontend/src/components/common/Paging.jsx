import './Paging.css';

export const Paging = ({ page, totalPage, setPage }) => {
  const pageCount = 5; // 한 번에 보여줄 페이지 번호 개수
  const pageGroup = Math.ceil(page / pageCount); // 현재 페이지 그룹

  let lastPage = pageGroup * pageCount; // 현재 그룹의 마지막 페이지
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  let firstPage = lastPage - (pageCount - 1); // 현재 그룹의 첫 페이지
  if (firstPage < 1) {
    firstPage = 1;
  }

  const pages = [];
  for (let i = firstPage; i <= lastPage; i++) {
    pages.push(i);
  }

  if (totalPage === 0) return null; // 페이지가 없으면 렌더링 안 함

  return (
    <div className="pagination">
      <button onClick={() => setPage(1)} disabled={page === 1} className="page-btn">
        «
      </button>
      <button onClick={() => setPage(page - 1)} disabled={page === 1} className="page-btn">
        ‹
      </button>

      <div className="page-numbers">
        {pages.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`page-num ${page === num ? "active" : ""}`}
          >
            {num}
          </button>
        ))}
      </div>

      <button onClick={() => setPage(page + 1)} disabled={page === totalPage} className="page-btn">
        ›
      </button>
      <button onClick={() => setPage(totalPage)} disabled={page === totalPage} className="page-btn">
        »
      </button>
    </div>
  );
};
