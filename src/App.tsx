import React, { useState, useCallback, useEffect } from 'react';
import CustomerList from './components/CustomerList';
import CustomerDetails from './components/CustomerDetails';
import { Customer } from './types/dummyData';
import './App.css';
import PhotoGrid from './components/PhotoGrid';

const App: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);
  const [nextPhotos, setNextPhotos] = useState<string[]>([]);

  const fetchDogPhotos = useCallback(async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random/9');
      const data = await response.json();
      if (data.status === 'success') {
        return data.message;
      }
      throw new Error('Failed to fetch images');
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  }, []);

  const updatePhotos = useCallback(async () => {
    const newPhotos = await fetchDogPhotos();
    setCurrentPhotos(prevPhotos => {
      setNextPhotos(newPhotos);
      return prevPhotos.length === 0 ? newPhotos : prevPhotos;
    });
  }, [fetchDogPhotos]);

  const updatedPhotosForNextCustomer = useCallback(async () => {
    const newCustomerPhotos = await fetchDogPhotos();
    setCurrentPhotos(prevPhotos => {
      setNextPhotos(newCustomerPhotos);
      return newCustomerPhotos;
    });
  }, [fetchDogPhotos]);

  const handleSelectCustomer = useCallback(async (customer: Customer) => {
    updatedPhotosForNextCustomer(); 
    setSelectedCustomer(customer);
  }, [updatedPhotosForNextCustomer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotos(nextPhotos);
      updatePhotos();
    }, 10000); 

    const renderInterval = setInterval(() => {
      setCurrentPhotos(prevPhotos => [...prevPhotos]); 
    }, 5000); 

    return () => {
      clearInterval(interval);
      clearInterval(renderInterval);
    };
  }, [updatePhotos, nextPhotos]);

  return (
    <div className="app">
      <div className="customer-list-container">
        <CustomerList onSelectCustomer={handleSelectCustomer} />
      </div>
      <div className="customer-details-wrapper">
        {selectedCustomer ? (
          <CustomerDetails 
            customer={selectedCustomer} 
            photoGrid={
              <PhotoGrid 
                currentPhotos={currentPhotos} 
                nextPhotos={nextPhotos}
              />
            }
          />
        ) : (
          <div className="no-customer-selected">
            Select a customer to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
