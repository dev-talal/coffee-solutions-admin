import TransactionGrid from '@/components/dashboard/popularGrid/TransactionGrid';

const Transactions = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <TransactionGrid />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
