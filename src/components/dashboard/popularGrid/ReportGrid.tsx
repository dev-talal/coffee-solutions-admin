import { CustomDataTable } from '@/components/common/CustomDataTable';
import {
  getReportColumns,
  reportRows,
  type Report,
} from '@/components/dashboard/popularGrid/columnData/reportData';
import { useTranslation } from 'react-i18next';

function ReportGrid() {
  const { t } = useTranslation();
  const columns = getReportColumns(t);

  const handleExport = () => {
    console.log('Export clicked');
  };

  return (
    <CustomDataTable<Report>
      columns={columns}
      data={reportRows}
      filterColumn="customer"
      enableRowSelection={false}
      showFilterBar={true}
      filterBarNames={[
        t('common.transaction_report'),
        t('common.product_sales'),
        t('common.sales_type'),
      ]}
      searchPlaceholder="Search Reports..."
      showSearch={false}
      Button1={{
        show: true,
        label: t('common.filter_by_date'),
        buttonType: 'date',
        onDateChange: (range) => {
          console.log('Selected date range:', range);
        },
      }}
      Button2={{
        show: true,
        label: t('common.export'),
        buttonType: 'export',
        onClick: handleExport,
      }}
    />
  );
}

export default ReportGrid;
