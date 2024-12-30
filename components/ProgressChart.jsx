import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import '../styles/global.css';

interface ProgressData {
  date: string;
  value: number;
}

/**
 * ProgressChart Component.
 * Displays a user's fitness progress using a line chart from recharts.
 * Fetches progress data from the /api/progress endpoint using useFetch hook.
 * @returns {JSX.Element} The ProgressChart component.
 */
const ProgressChart = () => {
  const { user } = useAuth();
  const [formattedData, setFormattedData] = useState<ProgressData[] | null>(null);
    const { data, loading, error } = useFetch(user?.userId ? `/api/progress?userId=${user.userId}` : null);


    useEffect(() => {
        if (data && Array.isArray(data)) {
            const formatted = data.map((item) => ({
                 date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              value: item.value,
            }));
             setFormattedData(formatted);
         } else{
           setFormattedData(null);
         }

    }, [data]);



  if (loading) {
    return <div className="text-center mt-4">Loading chart...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error loading chart data</div>;
  }

    if (!formattedData || formattedData.length === 0) {
         return <div className="text-center mt-4">No progress data available</div>;
     }

  return (
    <div className="mt-4" aria-label="Progress Chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date"  aria-label="Date Axis" />
          <YAxis aria-label="Value Axis"/>
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" aria-label="Progress Line"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
