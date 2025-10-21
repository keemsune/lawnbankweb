// 진단 라이브러리 메인 export 파일

// 타입 정의
export type {
  DiagnosisAnswers,
  ContactInfo,
  DiagnosisResult,
  CodedAnswers
} from './types';

// 매퍼 함수들
export {
  mapAnswersToCode,
  reverseMapCode
} from './mapper';

// 계산 함수들
export {
  calculateDiagnosisResult,
  generateResultSummary
} from './calculator';

// 메인 서비스
export {
  DiagnosisService,
  createSampleDiagnosisData,
  formatDiagnosisDataForTable
} from './service';

export type {
  CompleteDiagnosisData
} from './service';

// 데이터베이스 관리
export {
  DiagnosisDataManager
} from './database';

export type {
  DiagnosisRecord,
  DiagnosisTableRow,
  DiagnosisFilter,
  DiagnosisSortOption,
  PaginationOption
} from './database';
