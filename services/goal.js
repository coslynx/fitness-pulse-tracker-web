import useApi from '../services/api.js';

const goalService = () => {
    const { makeRequest } = useApi();

    const createGoal = async (userId, name, description, startDate, targetDate, targetValue, unit) => {
        try {
            const response = await makeRequest({
                url: '/api/goals',
                method: 'POST',
                data: {
                    userId: userId.trim(),
                    name: name.trim(),
                    description: description ? description.trim() : undefined,
                    startDate,
                    targetDate,
                    targetValue,
                    unit,
                },
                 headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
              if (error.response && error.response.data && error.response.data.message) {
                 console.error('Failed to create goal:', error.response.data.message);
                 throw new Error(`Failed to create goal: ${error.response.data.message}`);
                } else {
                     console.error('Failed to create goal:', error);
                     throw new Error('Failed to create goal: Internal server error');
                 }
        }
    };

    const getGoals = async (userId) => {
        try {
            const response = await makeRequest({
                url: '/api/goals',
                method: 'GET',
                params: { userId: userId ? userId.trim() : undefined },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to fetch goals:', error.response.data.message);
                 throw new Error(`Failed to fetch goals: ${error.response.data.message}`);
                } else{
                   console.error('Failed to fetch goals:', error);
                  throw new Error('Failed to fetch goals: Internal server error');
              }
        }
    };

    const getGoalById = async (id) => {
        try {
            const response = await makeRequest({
                url: `/api/goals/${id}`,
                method: 'GET',
                 headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                console.error('Failed to fetch goal:', error.response.data.message);
                  throw new Error(`Failed to fetch goal: ${error.response.data.message}`);
                } else {
                   console.error('Failed to fetch goal:', error);
                   throw new Error('Failed to fetch goal: Internal server error');
                }
        }
    };

    const updateGoal = async (id, name, description, startDate, targetDate, targetValue, unit) => {
         try {
            const response = await makeRequest({
                url: `/api/goals/${id}`,
                method: 'PUT',
                data: {
                    name: name ? name.trim() : undefined,
                    description: description ? description.trim() : undefined,
                    startDate,
                    targetDate,
                    targetValue,
                    unit,
                },
                 headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
             if (error.response && error.response.data && error.response.data.message) {
                 console.error('Failed to update goal:', error.response.data.message);
                 throw new Error(`Failed to update goal: ${error.response.data.message}`);
              } else {
                    console.error('Failed to update goal:', error);
                    throw new Error('Failed to update goal: Internal server error');
               }
        }
    };

    const deleteGoal = async (id) => {
         try {
            await makeRequest({
                url: `/api/goals/${id}`,
                method: 'DELETE',
                 headers: {
                    'Content-Type': 'application/json',
                }
            });
             return;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
               console.error('Failed to delete goal:', error.response.data.message);
               throw new Error(`Failed to delete goal: ${error.response.data.message}`);
            } else {
                 console.error('Failed to delete goal:', error);
                 throw new Error('Failed to delete goal: Internal server error');
            }
        }
    };

    return {
        createGoal,
        getGoals,
        getGoalById,
        updateGoal,
        deleteGoal,
    };
};

export default goalService;
