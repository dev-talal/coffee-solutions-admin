import { DynamicIcon } from 'lucide-react/dynamic';
import { useTranslation } from 'react-i18next';

const BackButtonNavigation = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  return (
    <div
      className="flex w-max items-center gap-1 text-lg font-semibold mb-4 cursor-pointer"
      onClick={() => window.history.back()}
    >
      <DynamicIcon name={isRtl ? 'arrow-right' : 'arrow-left'} className="h-4 w-4" />
      &nbsp;
      <span>{t('common.back')}</span>
    </div>
  );
};

export default BackButtonNavigation;
