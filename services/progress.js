import useApi from '../services/api.js';

const progressService = () => {
    const { makeRequest } = useApi();

    const createProgress = async (userId, goalId, date, value) => {
        try {
            if (!userId || typeof userId !== 'string' || !userId.trim()) {
                throw new Error('Invalid userId: userId must be a non-empty string');
            }
            if (!goalId || typeof goalId !== 'string' || !goalId.trim()) {
                 throw new Error('Invalid goalId: goalId must be a non-empty string');
            }
            if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
                throw new Error('Invalid date: date must be a valid Date object');
            }
            if (typeof value !== 'number' || value <= 0) {
                 throw new Error('Invalid value: value must be a positive number');
            }

            const response = await makeRequest({
                url: '/api/progress',
                method: 'POST',
                data: {
                    userId: userId.trim(),
                    goalId: goalId.trim(),
                    date,
                    value,
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
             return response;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to create progress:', error.response.data.message);
                throw new Error(`Failed to create progress: ${error.response.data.message}`);
            } else {
                 console.error('Failed to create progress:', error);
                 throw new Error('Failed to create progress: Internal server error');
            }
        }
    };

    const getProgresses = async (userId) => {
        try {
             let params = {};
            if (userId) {
                 if (typeof userId !== 'string' || !userId.trim()) {
                   throw new Error('Invalid userId: userId must be a non-empty string');
                }
                params.userId = userId.trim();
            }
            const response = await makeRequest({
                url: '/api/progress',
                method: 'GET',
                params,
                 headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to fetch progresses:', error.response.data.message);
                throw new Error(`Failed to fetch progresses: ${error.response.data.message}`);
             }else {
                console.error('Failed to fetch progresses:', error);
               throw new Error('Failed to fetch progresses: Internal server error');
            }
        }
    };

    const getProgressById = async (id) => {
         try {
            if (!id || typeof id !== 'string' || !id.trim()) {
               throw new Error('Invalid progress id: id must be a non-empty string');
            }
            const response = await makeRequest({
                url: `/api/progress/${id}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
             return response;
        } catch (error) {
             if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to fetch progress:', error.response.data.message);
                 throw new Error(`Failed to fetch progress: ${error.response.data.message}`);
               } else {
                console.error('Failed to fetch progress:', error);
                 throw new Error('Failed to fetch progress: Internal server error');
              }
        }
    };

    const updateProgress = async (id, date, value) => {
         try {
            if (!id || typeof id !== 'string' || !id.trim()) {
                throw new Error('Invalid progress id: id must be a non-empty string');
             }

            if (date && (!(date instanceof Date) || isNaN(date.getTime()))) {
                throw new Error('Invalid date: date must be a valid Date object');
            }

             if (value && (typeof value !== 'number' || value <= 0)) {
                throw new Error('Invalid value: value must be a positive number');
            }

            const response = await makeRequest({
                url: `/api/progress/${id}`,
                method: 'PUT',
                data: {
                  date,
                  value,
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
             if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to update progress:', error.response.data.message);
                throw new Error(`Failed to update progress: ${error.response.data.message}`);
            } else{
                console.error('Failed to update progress:', error);
                throw new Error('Failed to update progress: Internal server error');
            }
        }
    };

    const deleteProgress = async (id) => {
          try {
             if (!id || typeof id !== 'string' || !id.trim()) {
                throw new Error('Invalid progress id: id must be a non-empty string');
             }
            await makeRequest({
                url: `/api/progress/${id}`,
                method: 'DELETE',
                 headers: {
                    'Content-Type': 'application/json',
                }
            });
              return;
        } catch (error) {
              if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to delete progress:', error.response.data.message);
                throw new Error(`Failed to delete progress: ${error.response.data.message}`);
              } else{
                console.error('Failed to delete progress:', error);
                throw new Error('Failed to delete progress: Internal server error');
              }
        }
    };

    return {
        createProgress,
        getProgresses,
        getProgressById,
        updateProgress,
        deleteProgress,
    };
};

export default progressService;
