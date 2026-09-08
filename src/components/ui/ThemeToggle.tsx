import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

/** Bascule thème clair / sombre — sombre par défaut. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!isDark}
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      title={isDark ? 'Thème clair' : 'Thème sombre'}
      className={cn(
        'group relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-or/25 text-ivoire/85 transition-colors duration-400 hover:border-or/50 hover:text-or-clair',
        className,
      )}
    >
      <Sun
        size={16}
        strokeWidth={1.3}
        aria-hidden="true"
        className={cn(
          'absolute transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isDark ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100',
        )}
      />
      <Moon
        size={16}
        strokeWidth={1.3}
        aria-hidden="true"
        className={cn(
          'absolute transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isDark ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0',
        )}
      />
    </button>
  );
}
