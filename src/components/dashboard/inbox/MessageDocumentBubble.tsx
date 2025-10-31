import { useMemo, useState } from 'react';
import type { InboxMessage } from '@/common/types/InboxTypes';
import '@/pdfWorkerConfig';
import { Document, Page } from 'react-pdf';
import { DynamicIcon } from 'lucide-react/dynamic';

const MessageDocumentBubble = ({ msg }: { msg: InboxMessage }) => {
  const [pdfPages, setPdfPages] = useState<number>(0);
  const fileName = useMemo(() => {
    return msg.document && msg.document.split('/').pop();
  }, [msg]);

  return (
    <>
      <div className="w-full  h-[89px] overflow-hidden">
        <Document
          onLoadSuccess={(v) => setPdfPages(v.numPages)}
          file={msg.document}
          loading={
            <div className="flex items-center justify-center p-3">
              <DynamicIcon name="loader" className="animate-spin h-7 w-7" />
            </div>
          }
        >
          <Page pageNumber={1} width={232} />
        </Document>
      </div>
      <div className="bg-chat-receiver text-black p-2 text-sm">
        <p className="text-xs text-black font-semibold">{fileName}</p>
        {pdfPages} {pdfPages > 1 ? 'pages' : 'page'}.687 kb PDF
      </div>
      {msg.text && (
        <p className="text-[16px] p-2 leading-5 text-black bg-yellow-500/6">{msg.text}</p>
      )}
    </>
  );
};

export default MessageDocumentBubble;
