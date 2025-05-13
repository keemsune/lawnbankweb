export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mt-10">
          <span className="text-blue-600">Bank</span> Web
        </h1>
        <p className="mt-3 text-2xl">
          안녕하세요, 은행 웹사이트에 오신 것을 환영합니다!
        </p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="#"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">계좌 조회 &rarr;</h3>
            <p className="mt-4 text-xl">
              계좌 잔액과 거래 내역을 확인하세요.
            </p>
          </a>

          <a
            href="#"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">송금 &rarr;</h3>
            <p className="mt-4 text-xl">
              다른 계좌로 안전하게 송금하세요.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>
          © 2025 Bank Web. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 