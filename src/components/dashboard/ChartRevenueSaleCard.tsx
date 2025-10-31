import { useMemo, useState, useTransition } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';
import { fillMissingDates } from '@/lib/utils';
import type { SalesChartData } from '@/common/types/chartTypes';
import { presetsDatePicker } from '@/helpers/dataFormat';

const ChartRevenueSaleCard = ({
  salesData,
  range,
  setRange,
}: {
  salesData: SalesChartData[];
  range: { from: Date; to?: Date };
  setRange: { (val: { from: Date; to?: Date }): void };
}) => {
  const { t } = useTranslation();
  const [presetLabel, setPresetLabel] = useState('Custom');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const chartConfig = {
    total_sales: {
      label: `${t('chart.sales')}`,
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  const chartData = useMemo(() => {
    return [...salesData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        ...item,
        total_sales: Number(item.total_sales),
      }));
  }, [salesData]);

  const applyPreset = (label: string, days: number | null) => {
    setPresetLabel(label);

    if (days === null) {
      setShowCalendar(true);
    } else {
      const now = new Date();
      const from = new Date();
      from.setDate(now.getDate() - (days - 1));
      startTransition(() => {
        setRange({ from, to: now });
        setOpenDatePicker(false);
      });
    }
  };

  const filteredData = useMemo(() => {
    if (!range?.from || !range?.to) return chartData;
    return fillMissingDates(chartData, range.from, range.to);
  }, [chartData]);

  return (
    <Card className="pt-0 shadow-none rounded-[20px] h-full relative">
      <CardHeader className="flex items-center border-b-0 gap-2 space-y-0 py-5 sm:flex-row">
        <div className="flex flex-wrap gap-2 justify-between w-full">
          <CardTitle className="text-[18px] font-bold">
            {t('chart.sales')}&nbsp;{t('chart.analytics')}
          </CardTitle>

          <div className="flex gap-4 flex-wrap">
            <div className="flex space-between items-center space-x-3">
              <div className="w-2 h-2 bg-[#402020] rounded-full" />
              <span className="text-lg lg:text-sm xl:text-base 2xl:text-lg font-bold">
                {t('chart.sales')}
              </span>
            </div>

            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button
                  variant="outline"
                  className="justify-between text-left font-normal lg:w-[230px] sm:w-auto"
                  disabled={isPending}
                >
                  <div className="flex">
                    <DynamicIcon name="calendar-days" className="mr-2 h-4 w-4" />
                    {range?.from && range.to ? (
                      <>
                        {format(range.from, 'MMM d, yyyy')} - {format(range.to, 'MMM d, yyyy')}
                      </>
                    ) : (
                      <span>{t('chart.selectRange')}</span>
                    )}
                  </div>
                  <DynamicIcon name="chevron-down" className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 space-y-2">
                {presetsDatePicker.map(({ label, days }) => (
                  <Button
                    key={label}
                    variant={presetLabel === label ? 'default' : 'ghost'}
                    className={`w-full justify-start cursor-pointer ${
                      presetLabel === label
                        ? 'bg-coffee-brown text-white hover:bg-coffee-brown'
                        : ''
                    }`}
                    onClick={() => applyPreset(label, days)}
                    disabled={isPending}
                  >
                    {t(`chart.${label.replace(/\s/g, '').toLowerCase()}`)}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            {showCalendar && (
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <span />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={(val) => {
                      if (val?.from && val?.to) {
                        setRange({
                          from: val.from,
                          to: val.to ? val.to : undefined,
                        });
                      }
                    }}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                    disabled={{ before: new Date('2015-01-01'), after: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-2 mt-8 relative">
        <ChartContainer config={chartConfig} className="w-full h-[250px]">
          <AreaChart margin={{ top: 10, left: 20, right: 20 }} data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              minTickGap={0}
              interval="preserveStartEnd"
              tick={({ payload, x, y }) => {
                const date = new Date(payload.value);
                const formatted = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <text x={x} y={y} textAnchor={'middle'} fill="#666" fontSize={12}>
                    {formatted}
                  </text>
                );
              }}
            />

            <YAxis
              dataKey="total_sales"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              allowDecimals={false}
              tickCount={5}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 100) * 100]}
              tickFormatter={(value) => value.toLocaleString('en-US')}
            />

            <ChartTooltip
              cursor
              animationDuration={200}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                  indicator="dot"
                />
              }
            />

            {Object.entries(chartConfig).map(([key, config]) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                stroke={config.color}
                fill={`url(#fill-${key})`}
                strokeWidth={4}
                animationDuration={2000}
                baseValue={0}
                activeDot={({ cx, cy, fill }) => {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      stroke="white"
                      strokeWidth={2}
                      fill={fill || config.color}
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                      }}
                    />
                  );
                }}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartRevenueSaleCard;
