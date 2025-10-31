import { Button } from '@/components/ui/button';
import { useTheme } from '../theme-provider';
import { DynamicIcon } from 'lucide-react/dynamic';

const ThemeToggleButton = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    const next = theme == 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={toggleTheme}
      className="w-11 h-11 rounded-full relative cursor-pointer overflow-hidden"
    >
      <DynamicIcon
        name="sun"
        className={`size-6
          absolute transition-al fill-yellow-400 stroke-amber-400 duration-400 ease-out 
          ${theme == 'dark' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
        `}
      />
      <DynamicIcon
        name="moon"
        className={`
          absolute transition-all text-yellow-100 duration-400 ease-out size-6
          ${theme == 'dark' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      />
    </Button>
  );
};

export default ThemeToggleButton;
