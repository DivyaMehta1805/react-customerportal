import React from 'react';
import { Customer } from '../types/dummyData';

interface CustomerDetailsProps {
  customer: Customer;
  photoGrid: React.ReactNode;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, photoGrid }) => {
  return (
    <div className="customer-details">
      <h2>{customer.name}</h2>
      <p>{customer.title}</p>
      <p>{customer.address}</p>
      {photoGrid}
    </div>
  );
};

export default React.memo(CustomerDetails);