import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegionCityGrid from '@/components/dashboard/popularGrid/RegionDetailGrid';
import { useCitiesQuery } from '@/features/api/regions/citiesApi';
import { useTranslation } from 'react-i18next';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';
interface Region {
  id: string;
  name: string;
  ar_name: string;
  status: string;
}

const RegionDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { id: region_id } = useParams();
  const [region, setRegion] = useState<Region | null>(null);

  const { data, isLoading } = useCitiesQuery(
    { page: 1, region_id, search: '' },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (data?.data?.region) {
      const regionData = data?.data?.region;
      setRegion({
        id: regionData.id.toString(),
        name: regionData.name,
        ar_name: regionData.ar_name,
        status: regionData.status === '1' ? 'Active' : 'Inactive',
      });
    }
  }, [data, region_id]);

  return (
    <>
      <BackButtonNavigation />
      <div className="container mx-auto p-4 space-y-4">
        {region && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h1 className="text-2xl font-bold">
                      {t('common.region')}: {isRtl ? region.ar_name : region.name}
                    </h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    {t('common.status')} : <strong>{region.status}</strong>
                  </p>
                  <div className="flex items-center font-medium text-lg mt-1">
                    <span>
                      {t('common.cities_in')} {isRtl ? region.ar_name : region.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            {!data?.data?.region && !isLoading ? (
              <h3 className="text-red-500 text-lg font-semibold">{t(`common.no_region_found`)}</h3>
            ) : (
              <RegionCityGrid region_id={region_id as string} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RegionDetailsPage;
