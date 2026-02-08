/**
 * iOS Safari에서 안전하게 날짜를 파싱하기 위한 유틸리티
 * Safari는 "2025.10.14" 같은 점(.) 구분 형식을 인식하지 못함
 * 이 함수는 점을 하이픈(-)으로 변환하여 모든 브라우저에서 작동하도록 함
 */

export const safeParseDateString = (dateString: string | undefined | null): Date => {
  if (!dateString) {
    return new Date();
  }
  
  // 점(.)을 하이픈(-)으로 변환 (예: "2025.10.14" -> "2025-10-14")
  const safeString = dateString.replace(/\./g, '-');
  
  const parsed = new Date(safeString);
  
  // Invalid Date 체크
  if (isNaN(parsed.getTime())) {
    console.warn(`Failed to parse date: "${dateString}", using current date instead`);
    return new Date();
  }
  
  return parsed;
};

export const safeDateToISOString = (dateString: string | undefined | null): string => {
  return safeParseDateString(dateString).toISOString();
};
