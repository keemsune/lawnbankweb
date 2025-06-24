import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 임시 데이터 저장 경로 (실제로는 데이터베이스 사용 필요)
const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'diagnosis_submissions.json');

// 데이터 디렉토리 생성 함수
const ensureDataDirExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([]));
  }
};

// 진단 답변 데이터 저장 함수
const saveSubmission = (submission: any) => {
  ensureDataDirExists();
  
  // 기존 데이터 읽기
  const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
  const submissions = JSON.parse(fileContent);
  
  // 새 제출 데이터 추가
  submissions.push({
    id: submissions.length + 1,
    ...submission,
    submittedAt: new Date().toISOString()
  });
  
  // 파일에 저장
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  
  return submissions.length; // 제출 ID 반환
};

export async function POST(request: Request) {
  try {
    // 요청 본문에서 데이터 파싱
    const submissionData = await request.json();
    
    // 필수 필드 검증
    if (!submissionData.answers || !submissionData.contactInfo) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 연락처 정보 검증
    const { name, phone, email } = submissionData.contactInfo;
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: '연락처 정보가 유효하지 않습니다.' },
        { status: 400 }
      );
    }
    
    // 데이터 저장
    const submissionId = saveSubmission(submissionData);
    
    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '진단 정보가 성공적으로 저장되었습니다.',
      submissionId
    });
  } catch (error) {
    console.error('진단 정보 저장 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// GET 요청 처리 (관리자용 - 실제로는 인증 필요)
export async function GET(request: Request) {
  try {
    ensureDataDirExists();
    
    // 파일에서 데이터 읽기
    const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    const submissions = JSON.parse(fileContent);
    
    // 응답
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('진단 정보 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 