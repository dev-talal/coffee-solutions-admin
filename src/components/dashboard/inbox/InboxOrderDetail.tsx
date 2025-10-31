import { lazy, Suspense } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarContent, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useWindowSize } from '@/hooks/use-window-size';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';

const HoverableScrollArea = lazy(() => import('@/components/partials/HoverableScrollArea'));

type InboxOrderDetailProps = {
  setRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
};

const InboxOrderDetail = ({ setRightPanel }: InboxOrderDetailProps) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();

  return (
    <div
      className="static h-full inbox-users"
      style={{
        width: '19rem',
      }}
    >
      <SidebarHeader className="bg-card flex-row fle gap-4 items-center text-card-foreground px-4 py-5">
        <div className="rounded-lg w-[40px] flex items-center justify-center h-[40px] bg-chat-receiver">
          <DynamicIcon name="package" className="h-5 w-5" />
        </div>
        <h5 className="text-xl font-bold">{t('chat.Order_Details')}</h5>
        {width < 1280 && (
          <div className="flex justify-end p-2 ms-auto">
            <Button variant="ghost" size="icon" onClick={() => setRightPanel(false)}>
              <DynamicIcon name="x" className="size-6 mt-[-40px] mr-[-30px] text-red-700" />
            </Button>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="bg-card text-card-foreground h-full">
        <Suspense>
          <HoverableScrollArea>
            <SidebarMenu className="px-4">
              <div className="flex items-center mt-2 justify-between flex-wrap">
                <span>{t('common.order')} #1</span>
                <time className="font-semibold">June 1, 2023, 08:22 AM</time>
              </div>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-4">
                <AccordionItem value={`item-1`} className=" border-b-0">
                  <AccordionTrigger className="hover:no-underline [&_svg]:size-6 font-semibold text-xl">
                    {t('chat.product')}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance py-1">
                    {[...Array(2)].map((_, i) => (
                      <div key={`item-${i + 1}`} className={`${i !== 1 && 'border-b'} pt-2 pb-3`}>
                        <div className="flex-wrap flex gap-3 items-start">
                          <Avatar className="size-14 rounded-[8px]">
                            <AvatarImage
                              src={`https://randomuser.me/api/portraits/men/${i + 1 * 2}.jpg`}
                              className="border"
                            />
                            <AvatarFallback>MB</AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="font-semibold text-[14px]">Coffee Samples 5 Pack </h5>
                            <span className="text-gray-500">ID: 088134NT</span>
                          </div>
                        </div>
                        <div className="flex items-center  justify-between flex-wrap">
                          <span className="mt-2">Order #1</span>
                          <span className="font-semibold mt-2">$23.00</span>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value={`item-2`} className=" border-b-0">
                  <AccordionTrigger className="hover:no-underline [&_svg]:size-6 font-semibold text-xl">
                    {t('chat.delivery')}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance py-1">
                    <div className="flex items-start gap-3">
                      <DynamicIcon name="truck" size={30} />
                      <div>
                        <h5 className="font-medium text-[16px]">dpopexpress </h5>
                        <p className="text-sm">Lorem ipsum dolor </p>
                      </div>
                      <span className="font-semibold mt-2 ms-auto">$23.00</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value={`item-3`} className="border-0">
                  <AccordionTrigger className="hover:no-underline [&_svg]:size-6 font-semibold text-xl">
                    {t('chat.address')}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance pb-1">
                    <div className=" gap-3">
                      <address className="text-[16px] not-italic mb-4">
                        2464 Royal Ln. Mesa, New Jersey 45463
                      </address>
                      <iframe
                        className="border-0 rounded-2xl"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46830151.11795828!2d-119.8093025!3d44.24236485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2s!4v1752778563667!5m2!1sen!2s"
                        height="250"
                        width="100%"
                      ></iframe>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value={`item-4`} className=" border-b-0">
                  <AccordionTrigger className="hover:no-underline [&_svg]:size-6 font-semibold text-xl">
                    {t('chat.payment')}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance py-1">
                    <div className="flex items-start gap-3">
                      <p className="text-[16px]">{t('chat.subtotal')} ( 2 product)</p>
                      <span className="font-semibold  ms-auto">$23.00</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <p className="text-[16px]">{t('chat.delivery_fee')}</p>
                      <span className="font-semibold  ms-auto">$3.00</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <p className="text-[16px]">{t('chat.tax')}</p>
                      <span className="font-semibold ms-auto">$3.00</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenu>
          </HoverableScrollArea>
        </Suspense>
      </SidebarContent>
    </div>
  );
};

export default InboxOrderDetail;
