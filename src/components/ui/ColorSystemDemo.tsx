export default function ColorSystemDemo() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">글로벌 토큰 컬러 시스템</h1>
      
      {/* 의미별 컬러 시스템 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">의미별 컬러 시스템</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary */}
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <div className="h-12 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-medium">Primary</span>
              </div>
              <p className="text-sm text-muted-foreground">브랜드 메인 컬러</p>
              <p className="text-xs font-mono text-gray-500">emerald-600 / #059669</p>
            </div>
          </div>
          
          {/* Secondary */}
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <div className="h-12 bg-secondary rounded flex items-center justify-center">
                <span className="text-secondary-foreground font-medium">Secondary</span>
              </div>
              <p className="text-sm text-muted-foreground">보조 컬러</p>
              <p className="text-xs font-mono text-gray-500">amber-500 / #F59E0B</p>
            </div>
          </div>
          
          {/* Tertiary */}
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <div className="h-12 bg-tertiary rounded flex items-center justify-center">
                <span className="text-tertiary-foreground font-medium">Tertiary</span>
              </div>
              <p className="text-sm text-muted-foreground">3차 컬러</p>
              <p className="text-xs font-mono text-gray-500">blue-500 / #3B82F6</p>
            </div>
          </div>
          
          {/* Destructive */}
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <div className="h-12 bg-destructive rounded flex items-center justify-center">
                <span className="text-destructive-foreground font-medium">Destructive</span>
              </div>
              <p className="text-sm text-muted-foreground">경고/삭제</p>
              <p className="text-xs font-mono text-gray-500">red-500 / #EF4444</p>
            </div>
          </div>
          
          {/* Muted */}
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <div className="h-12 bg-muted rounded flex items-center justify-center">
                <span className="text-muted-foreground font-medium">Muted</span>
              </div>
              <p className="text-sm text-muted-foreground">비활성화/보조</p>
              <p className="text-xs font-mono text-gray-500">gray-100 / #F3F4F6</p>
            </div>
          </div>
          
          {/* Accent */}
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <div className="h-12 bg-accent rounded flex items-center justify-center">
                <span className="text-accent-foreground font-medium">Accent</span>
              </div>
              <p className="text-sm text-muted-foreground">강조 컬러</p>
              <p className="text-xs font-mono text-gray-500">emerald-600 / #059669</p>
            </div>
          </div>
        </div>
      </section>

      {/* 기본 컬러 팔레트 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">기본 컬러 팔레트</h2>
        
        {/* Gray Scale */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Gray</h3>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded border border-gray-300 bg-gray-${shade}`}
                />
                <span className="text-xs mt-1 text-gray-600">{shade}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Emerald (Primary) */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Emerald (Primary)</h3>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded border border-gray-300 bg-emerald-${shade}`}
                />
                <span className="text-xs mt-1 text-gray-600">{shade}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Amber (Secondary) */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Amber (Secondary)</h3>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded border border-gray-300 bg-amber-${shade}`}
                />
                <span className="text-xs mt-1 text-gray-600">{shade}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Blue (Tertiary) */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Blue (Tertiary)</h3>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded border border-gray-300 bg-blue-${shade}`}
                />
                <span className="text-xs mt-1 text-gray-600">{shade}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Red (Destructive) */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Red (Destructive)</h3>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded border border-gray-300 bg-red-${shade}`}
                />
                <span className="text-xs mt-1 text-gray-600">{shade}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 활용 예시 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">활용 예시</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 버튼 예시 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">버튼</h3>
            <div className="space-y-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-emerald-700 transition-colors">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-amber-600 transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 bg-tertiary text-tertiary-foreground rounded-lg hover:bg-blue-600 transition-colors">
                Tertiary Button
              </button>
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-red-600 transition-colors">
                Destructive Button
              </button>
            </div>
          </div>
          
          {/* 카드 예시 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">카드</h3>
            <div className="p-4 bg-card border border-border rounded-lg">
              <h4 className="text-lg font-semibold text-card-foreground mb-2">카드 제목</h4>
              <p className="text-muted-foreground">카드 내용입니다. muted-foreground 컬러를 사용합니다.</p>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-sm text-accent">accent 컬러로 강조</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 