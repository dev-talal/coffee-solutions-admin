import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DynamicIcon } from 'lucide-react/dynamic';

interface FormFileProps {
  name: string;
  label?: string;
  className?: string;
  id?: string;
  accept?: string;
}

export const FormFile: React.FC<FormFileProps> = ({
  name,
  label,
  className,
  id,
  accept = 'image/*',
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const file = watch(name);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof FileList && file.length > 0) {
      const objectUrl = URL.createObjectURL(file[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof file === 'string') {
      setPreview(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleRemove = () => {
    setValue(name, null);
    setPreview(null);
  };

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={id || name}>{label}</Label>}

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl min-h-[140px] max-w-[142px] flex items-center justify-center cursor-pointer overflow-hidden group',
          preview ? 'border-gray-200' : 'border-gray-300 dark:border-white/40',
        )}
      >
        <input
          id={id || name}
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...register(name)}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="object-contain absolute inset-0 w-full h-full rounded-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove();
              }}
              className={`absolute top-[2px] ${
                document?.documentElement?.dir === 'rtl' ? 'left-[2px]' : 'right-[2px]'
              } z-10 bg-red-100 rounded-full p-1 shadow hover:bg-red-100`}
              aria-label="Remove image"
            >
              <DynamicIcon name="x" className="w-4 h-4 text-red-500" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-3 text-gray-400">
            <DynamicIcon
              name="image"
              className="w-8 h-8 mb-1 text-amber-400 group-hover:text-aber-500"
            />
            <span className="font-medium text-sm">{isRTL ? 'اختر صورة' : 'Choose an image'}</span>
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
