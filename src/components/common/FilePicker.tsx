import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FilePickerProps {
  label?: string;
  className?: string;
  id?: string;
  accept?: string;
  value?: File | string | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}

export const FilePicker: React.FC<FilePickerProps> = ({
  label,
  className,
  id = 'file-upload',
  accept = 'image/*',
  value = null,
  disabled = false,
  onChange,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === 'string') {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl min-h-[140px] max-w-[190px] flex items-center justify-center cursor-pointer overflow-hidden group',
          preview ? 'border-amber-400' : 'border-gray-300 dark:border-white/40',
        )}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={disabled}
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
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-red-100"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-3 text-gray-400">
            <ImageIcon className="w-8 h-8 mb-1 text-amber-400 group-hover:text-amber-500" />
            <span className="font-medium text-sm">{isRTL ? 'اختر صورة' : 'Choose an image'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
