import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DynamicIcon } from 'lucide-react/dynamic';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

const ChartStatsCard = ({
  title,
  value,
  cardIndex,
}: {
  title: string;
  value: string | number;
  cardIndex: number;
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n?.dir() === 'rtl';

  return (
    <Card className="@container/card overflow-hidden rounded-[20px] shadow-none relative">
      <CardContent className="px-4">
        <div className="text-[18px] mb-2">{title}</div>
        <CardTitle className="text-2xl font-bold tabular-nums mb-4 @[250px]/card:text-3xl">
          <CountUp end={Number(value ?? 0)} duration={1.5} />
        </CardTitle>
        <div
          className={cn(
            'absolute top-0 h-15 w-15  text-sidebar-accent flex items-center justify-center',
            {
              'bg-chart-1': cardIndex === 0,
              'bg-chart-2': cardIndex === 1,
              'bg-green-600': cardIndex === 2,
              'left-0 rounded-br-4xl': isRTL,
              'right-0 rounded-bl-4xl': !isRTL,
            },
          )}
        >
          <DynamicIcon
            name={cardIndex === 0 ? 'users' : cardIndex === 1 ? 'package' : 'banknote-arrow-down'}
            className="h-7 w-7 text-white"
          />
        </div>
        {/* <div className="flex gap-2 font-medium items-center">
          <Badge className="bg-pink-70 text-sm text-card-foreground">
            {t('chartStats.growthRate')}
          </Badge>
          <div className="line-clamp-1 flex gap-2 text-foreground/70">
            {t('chartStats.thisMonth')}
          </div>
        </div> */}
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-1.5 text-sm px-0">
        <ChartContainer config={chartConfig} className="h-[72.5px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={'var(--chart-1)'} />
                <stop offset="100%" stopColor="rgba(251, 235, 214, 0)" />
              </linearGradient>
            </defs>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#areaGradient)"
              fillOpacity={0.4}
              strokeWidth={1}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardFooter> */}
    </Card>
  );
};

export default ChartStatsCard;
