import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import ApiService from '../services/api';

const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const [halls, setHalls] = useState([]);
  const [films, setFilms] = useState([]);
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllData();
      setHalls(data.halls);
      setFilms(data.films);
      setSeances(data.seances);
    } catch (e) {
      setError(e.message);
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ halls, films, seances, loading, error, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
