export interface Customer {
    id: number;
    name: string;
    title: string;
    address: string;
    shortDescription: string;
  }
  export function generateDummyCustomers(count: number, startId: number = 0): Customer[] {
    return Array.from({ length: count }, (_, index) => ({
      id: startId + index + 1,
      name: `Customer ${startId + index + 1}`,
      title: `Title ${startId + index + 1}`,
      address:`address ${startId}`,
      shortDescription:`lorem impsum ${startId}`,
    }));
  }