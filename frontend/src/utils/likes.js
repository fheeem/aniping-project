// id를 기반으로 일관된 의사 난수(좋아요 수)를 생성합니다.
export const generateConsistentLikes = (id) => {
  const seed = parseInt(id.toString().replace(/\D/g, '')) || 0;
  // 간단한 해시 함수를 사용하여 100 ~ 5000 사이의 값 생성
  return (seed * 9301 + 49297) % 4900 + 100;
};
