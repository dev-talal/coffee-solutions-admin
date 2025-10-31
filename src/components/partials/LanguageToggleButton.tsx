import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageToggleButtonProps {
  className?: string;
}

const LanguageToggleButton: React.FC<LanguageToggleButtonProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    i18n.changeLanguage(i18n.language || 'en').then(() => {
      setCurrentLang(i18n.language || 'en');
    });
    if (i18n.language !== 'en') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [i18n]);

  const toggleLanguage = () => {
    const next = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next).then(() => {
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      setCurrentLang(next);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            type="button"
            onClick={toggleLanguage}
            className={cn('relative overflow-hidden h-11 w-11 rounded-full', className)}
          >
            <span
              className={cn(
                'absolute transition-all duration-300 ease-out text-sm font-bold',
                currentLang === 'en' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
              )}
            >
              AR
            </span>
            <span
              className={cn(
                'absolute transition-all duration-300 ease-out text-sm font-bold',
                currentLang === 'ar' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
              )}
            >
              EN
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Language</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageToggleButton;
