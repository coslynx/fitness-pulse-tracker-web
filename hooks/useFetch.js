import { useState, useEffect } from 'react';
import axios from 'axios';
import useApi from '../services/api';
import { sanitizeInput } from '../utils/helpers';

/**
 * Custom React hook for making HTTP requests to the backend API.
 * @param {string} url - The API endpoint to fetch data from.
 * @returns {{
 *   data: any | null,
 *   loading: boolean,
 *   error: any | null
 * }} An object containing the fetched data, loading state, and error object.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { makeRequest } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest({
            url: sanitizeInput(url),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
              },
          });
          
        setData(response);
        setLoading(false);
         setError(null);
      } catch (err) {
         if (err.response && err.response.status === 401) {
            setLoading(false);
            setError(err);
        } else{
           console.error('Error fetching data:', err);
           setError(err);
           setLoading(false);
        }
      }
    };
    if (url) {
        fetchData();
    }
      return () => {
          setData(null);
          setLoading(false);
          setError(null);
      };
  }, [url, makeRequest]);

  return { data, loading, error };
};

export default useFetch;
