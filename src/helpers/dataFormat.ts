type TData = {
  id: string | number;
  name: string;
};

type TUsersData = {
  id: string | number;
  first_name: string;
  last_name: string;
};

export const formatOptions = <T extends TData>(
  data: T[] | undefined,
): { label: string; value: string }[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));
};

export const formatUsersOptions = <T extends TUsersData>(
  data: T[] | undefined,
): { label: string; value: string }[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    label: `${item.first_name} ${item.last_name}`,
    value: item.id.toString(),
  }));
};

export function getAvatarText(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (typeof acc !== 'object' || acc === null) return undefined;

    const match = key.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const [, arrKey, index] = match;
      const array = (acc as Record<string, unknown>)[arrKey];
      if (Array.isArray(array)) {
        return array[Number(index)];
      }
      return undefined;
    }

    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export function formatStringToDateTime(date: string) {
  const dateTime = new Date(date);
  return dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
}

export const presetsDatePicker = [
  { label: 'Last 3 Days', days: 3 },
  { label: 'Last 5 Days', days: 5 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last 365 Days', days: 365 },
  { label: 'Custom', days: null },
];

export const addressFields = [
  {
    name: 'short_address',
    label: 'shortAddressEnglish',
    placeholder: 'shortAddress',
  },
  {
    name: 'ar_short_address',
    label: 'shortAddressArabic',
    placeholder: 'shortAddress',
  },
  {
    name: 'building_number',
    label: 'buildingNumberEnglish',
    placeholder: 'buildingNumber',
  },
  {
    name: 'ar_building_number',
    label: 'buildingNumberArabic',
    placeholder: 'buildingNumber',
  },
  {
    name: 'secondary_number',
    label: 'secondaryNumberEnglish',
    placeholder: 'secondaryNumber',
  },
  {
    name: 'ar_secondary_number',
    label: 'secondaryNumberArabic',
    placeholder: 'secondaryNumber',
  },
  { name: 'city', label: 'cityNameEnglish', placeholder: 'cityName' },
  { name: 'ar_city', label: 'cityNameArabic', placeholder: 'cityName' },
  { name: 'postal_code', label: 'postalCode', placeholder: 'postalCode' },
  { name: 'ar_postal_code', label: 'postalCode', placeholder: 'postalCode' },
];
