export default function DemoBox() {
  return (
    <div className="space-y-4">
      {/* CSS 변수를 직접 사용하는 예시 */}
      <div 
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-accent-foreground)',
          borderColor: 'var(--color-border)'
        }}
      >
        <p className="font-medium">CSS 변수 직접 사용 예시</p>
        <p className="text-sm opacity-90">var(--color-accent) 배경색 사용</p>
      </div>

      {/* 커스텀 유틸리티 클래스 사용 예시 */}
      <div className="p-4 rounded-lg bg-secondary-500 text-white">
        <p className="font-medium">커스텀 유틸리티 클래스 예시</p>
        <p className="text-sm opacity-90">bg-secondary-500 클래스 사용</p>
      </div>
    </div>
  )
} 