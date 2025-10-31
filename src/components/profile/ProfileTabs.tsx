import { useTranslation } from 'react-i18next';

export default function ProfileTabs({
  active = 'profile',
  setActive,
}: {
  active?: string;
  setActive: (tab: string) => void;
}) {
  const { t } = useTranslation();

  const tabs = [
    { key: 'profile', label: t('common.profile') },
    { key: 'changePassword', label: t('common.changePassword') },
  ];

  return (
    <div className="border-b px-8 py-4 bg-white dark:bg-transparent rounded-t-md">
      <div className="flex gap-2 text-sm font-medium">
        {tabs.map(({ key, label }) => {
          const isActive = key === active;
          const buttonClasses = `
            h-[36px]
            px-4
            font-semibold
            text-sm
            rounded-md sm:rounded-full
            border
            hover:bg-custom-beige
            hover:text-black
            drop-shadow-sm
            ${isActive ? 'bg-custom-beige text-black' : 'bg-transparent text-muted-foreground'}
          `;
          return (
            <button key={key} onClick={() => setActive(key)} className={buttonClasses}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
