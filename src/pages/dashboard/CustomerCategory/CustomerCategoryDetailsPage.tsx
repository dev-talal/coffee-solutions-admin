import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import CustCategoryDetailsGrid from '@/components/dashboard/popularGrid/CustomerCategoryDetailsGrid';
import { getStatusColorDual } from '@/helpers/colorStatus';
import DialogOption from '@/components/dashboard/Dialogue';
import type { CategoryDetails } from '@/components/dashboard/popularGrid/columnData/categorydetails';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

const Categories = {
  id: '1',
  name: 'Diamond',
};

function CategoryDetailsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetails | null>(null);

  const handleDelete = (row: CategoryDetails) => {
    setSelectedCategory(row);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (row: CategoryDetails) => {
    console.log('Edit category:', row);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      console.log('Category deleted:', selectedCategory);
      setDeleteDialogOpen(false);
    }
  };

  const status = Categories.name;
  const colorClass = getStatusColorDual(status);

  return (
    <>
      <BackButtonNavigation />
      <div className="container mx-auto p-4 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle className="space-x-4 flex flex-row">
                  <h1 className="text-[24px]">Category : </h1>
                  <span className={`px-2 py-2 rounded text-xs font-semibold ${colorClass}`}>
                    {Categories.name}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <CustCategoryDetailsGrid onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </div>

        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[
            'Are you sure you want to delete this customer from this category?',
            'Cancel',
            'Delete',
          ]}
          loading={false}
        />
      </div>
    </>
  );
}

export default CategoryDetailsPage;
