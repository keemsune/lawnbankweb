/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px', 
      'md': '769px',
      'lg': '1025px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        // Basic Colors
        white: '#FFFFFF',
        black: '#000000',
        
        // Gray Scale
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        
        // Red Scale
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        
        // Pink Scale
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#500724',
        },
        
        // Violet Scale
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        
        // Indigo Scale
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        
        // Blue Scale
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#609AFA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1D4ED8',
          900: '#1E3A8A',
          950: '#172554',
        },
        
        // Emerald Scale
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        
        // Amber Scale
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },

        // === 의미별 컬러 시스템 ===
        
        // Primary Colors (브랜드 메인 컬러)
        primary: {
          DEFAULT: '#059669',
          foreground: '#FFFFFF',
        },
        
        // Secondary Colors (보조 컬러)
        secondary: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        
        // Tertiary Colors (3차 컬러)
        tertiary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        
        // Background Colors
        background: '#FFFFFF',
        'background-1': '#FFFFFF',
        'background-2': '#E5E7EB',
        
        // Foreground Colors
        foreground: '#030712',
        
        // Card Colors
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#030712',
        },
        
        // Popover Colors
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#030712',
        },
        
        // Muted Colors (비활성화/보조 텍스트)
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        
        // Accent Colors (강조 컬러)
        accent: {
          DEFAULT: '#059669',
          foreground: '#FFFFFF',
        },
        
        // Destructive Colors (경고/삭제)
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        
        // Border & Input Colors
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#059669',
      },
      // === 폰트 패밀리 시스템 ===
      fontFamily: {
        sans: ['var(--font-noto-sans-kr)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        title: ['var(--font-title)'],
      },
      
      // === 폰트 사이즈 시스템 ===
      fontSize: {
        // Display 타이포그래피 (큰 제목용)
        'display-2xl': ['72px', { lineHeight: '90px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['60px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '60px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['30px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-xs': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '700' }],
        
        // Title 타이포그래피 (임팩트 제목용 - Ria Sans 폰트)
        'title-3xl': ['96px', { lineHeight: '120px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'title-2xl': ['80px', { lineHeight: '100px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'title-xl': ['64px', { lineHeight: '80px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'title-lg': ['48px', { lineHeight: '60px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'title-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '800' }],
        'title-sm': ['30px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '800' }],
        
        // Heading 타이포그래피 (제목용)
        'heading-xl': ['20px', { lineHeight: '30px', letterSpacing: '0em', fontWeight: '700' }],
        'heading-lg': ['18px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '700' }],
        'heading-md': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '700' }],
        'heading-sm': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '700' }],
        'heading-xs': ['12px', { lineHeight: '18px', letterSpacing: '0.05em', fontWeight: '700' }],
        
        // Body 타이포그래피 (본문용)
        'body-xl': ['20px', { lineHeight: '30px', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '18px', letterSpacing: '0em', fontWeight: '400' }],
        
        // Label 타이포그래피 (라벨/버튼용)
        'label-xl': ['20px', { lineHeight: '30px', letterSpacing: '0em', fontWeight: '500' }],
        'label-lg': ['18px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '500' }],
        'label-md': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '500' }],
        'label-sm': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '500' }],
        'label-xs': ['12px', { lineHeight: '18px', letterSpacing: '0.05em', fontWeight: '500' }],
        
        // Caption 타이포그래피 (작은 텍스트용)
        'caption-lg': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'caption-md': ['12px', { lineHeight: '18px', letterSpacing: '0em', fontWeight: '400' }],
        'caption-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '400' }],
        'caption-xs': ['10px', { lineHeight: '14px', letterSpacing: '0.05em', fontWeight: '400' }],
      },
      
      // === 폰트 웨이트 시스템 ===
      fontWeight: {
        'thin': '100',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'bold': '700',
        'black': '900',
      },
      
      // === 라인 하이트 시스템 ===
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
      },
      
      // === 레터 스페이싱 시스템 ===
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      maxWidth: {
        'container': '1280px',
        'content': '1280px',
      },
      spacing: {
        '0': '0px',
        'px': '1px',
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
        '36': '144px',
        '40': '160px',
        '44': '176px',
        '48': '192px',
        '52': '208px',
        '56': '224px',
        '60': '240px',
        '64': '256px',
        '72': '288px',
        '80': '320px',
        '96': '384px',
      },
      gridTemplateColumns: {
        'mobile': 'repeat(4, 1fr)',
        'tablet': 'repeat(8, 1fr)',
        'desktop': 'repeat(12, 1fr)',
      },
      gap: {
        'mobile': '16px',
        'tablet': '16px',
        'desktop': '24px',
      },
      margin: {
        'container-xs': '16px',
        'container-sm': '24px',
        'container-md': '32px',
        'container-lg': '40px',
      },
      padding: {
        'container-xs': '16px',
        'container-sm': '24px',
        'container-md': '32px',
        'container-lg': '40px',
      },
      
      // Border Radius 시스템
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        'full': '9999px',
      },
      
      // Border Width 시스템
      borderWidth: {
        '0': '0px',
        'DEFAULT': '1px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
      },
      
      // 모바일 안전 높이 시스템
      height: {
        'mobile-safe': 'calc(100vh - env(safe-area-inset-bottom, 20px) - 80px)', // 더 보수적인 여유분
        'mobile-full': 'calc(100vh - env(safe-area-inset-bottom, 20px) - 20px)',
      },
    },
  },
  plugins: [],
} 