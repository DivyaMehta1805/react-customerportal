import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Customer, generateDummyCustomers } from '../types/dummyData';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const showScrollTopRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const customersPerBatch = 50;

  const fetchCustomers = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const newCustomers = generateDummyCustomers(customersPerBatch, offset);
      setCustomers(prevCustomers => [...prevCustomers, ...newCustomers]);
      setOffset(prevOffset => prevOffset + newCustomers.length);
      if (offset > 200 && !showScrollTopRef.current) {
        showScrollTopRef.current = true;
      }
      if (customers.length + newCustomers.length >= 1000) {
        setHasMore(false);
      }
    } catch (error) {
      setError('Error fetching customers. Please try again.');
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, customers.length]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCustomers();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchCustomers]);

  const handleSelectCustomer = useCallback((customer: Customer) => {
    if (selectedCustomerId !== customer.id) {
      setSelectedCustomerId(customer.id);
      onSelectCustomer(customer);
    }
  }, [onSelectCustomer, selectedCustomerId]);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop } = listRef.current;
      const shouldShowScrollTop = scrollTop > 200;
      if (shouldShowScrollTop !== showScrollTopRef.current) {
        showScrollTopRef.current = shouldShowScrollTop;
      }
    }
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="customer-list-container">
      <div className="customer-list" ref={listRef}>
        {customers.map(customer => (
          <div 
            key={customer.id}
            className={`customer-card ${selectedCustomerId === customer.id ? 'selected' : ''}`}
            onClick={() => handleSelectCustomer(customer)}
          >
            <h3>{customer.name}</h3>
            <p>{customer.title}</p>
          </div>
        ))}
        <div ref={loadMoreRef}>
          {isLoading && <div>Loading more customers...</div>}
          {error && <div>{error}</div>}
          {!hasMore && <div>No more customers to load</div>}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CustomerList);
