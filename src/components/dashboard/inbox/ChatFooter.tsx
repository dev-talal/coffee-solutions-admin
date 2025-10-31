import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';
import { usePostMessageMutation, useUploadFileMutation } from '@/features/api/chat/ChatApi';
import { useEffect, useRef, useState } from 'react';
import type { MessageType, PostMessagePayload } from '@/common/types/chatTypes';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { GENERAL_API_ERR_MSG } from '@/services/axios';
import type { AxiosError } from 'axios';

const ChatInput = ({
  roomId,
  onMessageSent,
}: {
  roomId: string;
  onMessageSent: (data: MessageType) => void;
}) => {
  const { t } = useTranslation();
  const [postMessage, { isLoading }] = usePostMessageMutation();
  const [uploadFile] = useUploadFileMutation();

  const [value, setValue] = useState<string>('');
  const [uploads, setUploads] = useState<
    { file: File; progress: number; uploaded: boolean; preview?: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleSubmit = async () => {
    if (!value.trim() && uploads.length === 0) return;

    const media: PostMessagePayload['media'] = uploads
      .filter((u) => u && u.preview)
      .map((u) => ({
        name: u.file.name,
        type: u.file.type,
        url: u.preview!,
      }));

    const payload: PostMessagePayload = {
      message: value,
      room_id: roomId,
      media,
    };

    const res = await postMessage({ message: payload }).unwrap();
    onMessageSent(res.data);
    setUploads([]);
    setValue('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUploads = files.map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    for (const file of files) {
      try {
        const res = await uploadFile({
          file,
          onProgress: (progress) =>
            setUploads((prev) => prev.map((u) => (u.file === file ? { ...u, progress } : u))),
        }).unwrap();
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, uploaded: true, progress: 100, preview: res.data } : u,
          ),
        );
      } catch (err) {
        const error = err as { data: unknown } & AxiosError;
        toast.error(
          ((error?.data as Record<string, unknown>)?.message as string) ??
            error.message ??
            GENERAL_API_ERR_MSG,
        );
        setUploads(uploads.filter((u) => u.file !== file));
      }
    }

    e.target.value = '';
  };

  const handleRemoveFile = (file: File) => {
    setUploads((prev) => prev.filter((u) => u.file !== file));
  };

  useEffect(() => {
    setUploads([]);
    setValue('');
  }, [roomId]);

  return (
    <div className="px-4">
      <Card className="mx-auto h-fit my-2 py-3 w-full px-4 shadow-[0px_0px_30px_rgba(0,0,0,0.04)]">
        <CardContent className="flex flex-col gap-2 px-0 bg-card">
          {uploads.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-2">
              {uploads.map((u, index) => (
                <div
                  key={index}
                  className="relative border rounded-xl p-2 w-20 h-20 flex flex-col items-center justify-between bg-muted/10 overflow-hidden"
                >
                  <div className="w-full h-12 flex items-center justify-center overflow-hidden rounded-lg">
                    {u.preview && u.file.type.startsWith('image/') ? (
                      <img
                        src={u.preview}
                        alt={u.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <DynamicIcon
                        name={
                          u.file.type.includes('video')
                            ? 'video'
                            : u.file.type.includes('pdf')
                              ? 'file-text'
                              : 'file'
                        }
                        className="w-8 h-8 text-muted-foreground"
                      />
                    )}
                  </div>

                  {/* File name (truncated to fit) */}
                  <p className="text-[10px] text-center text-muted-foreground truncate w-full px-1 mt-1">
                    {u.file.name}
                  </p>

                  {/* Upload progress bar */}
                  {!u.uploaded && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
                      <div
                        className="h-1 bg-amber-500 transition-all duration-200"
                        style={{ width: `${u.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Remove button */}
                  {u.uploaded && (
                    <button
                      onClick={() => handleRemoveFile(u.file)}
                      className="absolute cursor-pointer shadow-md top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    >
                      <DynamicIcon name="x" className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between w-full gap-2">
            <Input
              type="text"
              placeholder={t('chat.type_note')}
              onChange={(e) => setValue(e.target.value)}
              value={value}
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 px-0 shadow-none rounded-full"
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              disabled={isLoading}
              onClick={handleButtonClick}
            >
              <DynamicIcon name="paperclip" className="w-10 h-10" />
            </Button>

            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="
                image/*,
                video/*,
                application/pdf,
                application/msword,
                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.ms-excel,
                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                application/vnd.ms-powerpoint,
                application/vnd.openxmlformats-officedocument.presentationml.presentation,
                text/plain
              "
            />

            <Button
              variant="default"
              size="icon"
              className="bg-coffee-brown hover:bg-amber-600 dark:bg-amber-500 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <DynamicIcon
                name={isLoading ? 'loader' : 'send'}
                className={cn('w-10 h-10', { 'animate-spin': isLoading })}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInput;
