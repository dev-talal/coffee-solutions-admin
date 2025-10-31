import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from '@/components/ui/button';
import ReactDOMServer from 'react-dom/server';

const MySwal = withReactContent(Swal);

interface ConfirmModalOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Shows async confirmation modal with fully custom buttons
 */
export const confirmModal = async (options?: ConfirmModalOptions): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    MySwal.fire({
      title: options?.title || 'Are you sure?',
      icon: 'warning',
      html: options?.text || '',
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didRender: () => {
        const container = document.querySelector('.swal2-html-container');
        if (!container) return;

        const buttonsHtml = ReactDOMServer.renderToString(
          <div className="mt-6 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border cursor-pointer  lg:h-[48px] lg:w-[151px] md:h-[40px] md:w-full text-black font-semibold lg:text-lg bg-card dark:bg-white"
              id="swal-cancel-button"
            >
              {options?.cancelText || 'No'}
            </Button>
            <Button
              className="rounded-full cursor-pointer lg:h-[48px] lg:w-[151px] md:h-[40px] md:w-full bg-amber-400 hover:bg-amber-500 text-foreground font-semibold lg:text-lg"
              id="swal-confirm-button"
            >
              {options?.confirmText || 'Yes'}
            </Button>
          </div>,
        );

        container.insertAdjacentHTML('beforeend', buttonsHtml);

        // Add event listeners
        const confirmBtn = document.getElementById('swal-confirm-button');
        const cancelBtn = document.getElementById('swal-cancel-button');

        confirmBtn?.addEventListener('click', () => {
          resolve(true);
          MySwal.close();
        });

        cancelBtn?.addEventListener('click', () => {
          resolve(false);
          MySwal.close();
        });
      },
    });
  });
};
