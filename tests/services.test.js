import authService from '../services/auth';
import goalService from '../services/goal';
import progressService from '../services/progress';
import useApi from '../services/api';
import axios from 'axios';
import { sanitizeInput } from '../utils/helpers';

jest.mock('axios');
jest.mock('../services/api');
jest.mock('../utils/helpers', () => ({
  sanitizeInput: jest.fn(input => input),
}));

describe('Auth Service', () => {
  const mockedAxios = axios;
  const mockMakeRequest = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useApi.mockReturnValue({ makeRequest: mockMakeRequest });
        jest.spyOn(localStorage, 'setItem').mockReturnValue();
         jest.spyOn(localStorage, 'removeItem').mockReturnValue();
    });


  it('should login successfully and store token', async () => {
     mockMakeRequest.mockResolvedValue({ token: 'test-token', userId: 'user-id', username: 'testuser' });

    const { login } = authService();
    const response = await login('test@example.com', 'password');

    expect(mockMakeRequest).toHaveBeenCalledWith({
          url: '/api/auth/login',
          method: 'POST',
          data: { email: 'test@example.com', password: 'password' },
          headers: { 'Content-Type': 'application/json' },
      });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(response).toEqual({ token: 'test-token', userId: 'user-id', username: 'testuser' });
  });


  it('should handle login failure with correct message', async () => {
     mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
    const { login } = authService();

    await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
  });

     it('should handle login failure with generic message when message is not provided', async () => {
        mockMakeRequest.mockRejectedValue(new Error());

        const { login } = authService();
         await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Login failed: Internal server error');
      });


  it('should signup successfully and store token', async () => {
      mockMakeRequest.mockResolvedValue({ token: 'test-token', userId: 'user-id', username: 'testuser' });

    const { signup } = authService();
    const response = await signup('testuser', 'test@example.com', 'password');


    expect(mockMakeRequest).toHaveBeenCalledWith({
        url: '/api/auth/signup',
        method: 'POST',
        data: { username: 'testuser', email: 'test@example.com', password: 'password' },
          headers: { 'Content-Type': 'application/json' },
      });
       expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(response).toEqual({ token: 'test-token', userId: 'user-id', username: 'testuser' });
  });


  it('should handle signup failure with correct message', async () => {
      mockMakeRequest.mockRejectedValue({ response: { data: { message: 'User already exists' } } });
    const { signup } = authService();

    await expect(signup('testuser', 'test@example.com', 'password')).rejects.toThrow('User already exists');
  });

    it('should handle signup failure with generic message when message is not provided', async () => {
         mockMakeRequest.mockRejectedValue(new Error());
        const { signup } = authService();
        await expect(signup('testuser', 'test@example.com', 'password')).rejects.toThrow('Signup failed: Internal server error');
    });

  it('should logout and remove token', () => {
    localStorage.setItem('token', 'test-token');
      const { logout } = authService();
       logout();

        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
});

describe('Goal Service', () => {
     const mockedAxios = axios;
     const mockMakeRequest = jest.fn();

    beforeEach(() => {
         jest.clearAllMocks();
        useApi.mockReturnValue({ makeRequest: mockMakeRequest });
          jest.spyOn(localStorage, 'setItem').mockReturnValue();
         jest.spyOn(localStorage, 'removeItem').mockReturnValue();
    });


  it('should create a goal successfully', async () => {
        mockMakeRequest.mockResolvedValue({ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: new Date(), targetDate: new Date(), targetValue: 100, unit: 'kg' });
    const { createGoal } = goalService();
    const startDate = new Date();
      const targetDate = new Date();
    const response = await createGoal('user-id', 'Test Goal', 'Test Description', startDate, targetDate, 100, 'kg');
    expect(mockMakeRequest).toHaveBeenCalledWith({
        url: '/api/goals',
        method: 'POST',
        data: {
            userId: 'user-id',
            name: 'Test Goal',
            description: 'Test Description',
            startDate: startDate,
            targetDate: targetDate,
            targetValue: 100,
            unit: 'kg',
        },
            headers: { 'Content-Type': 'application/json' },
    });
    expect(response).toEqual({
      id: 'goal-id',
      name: 'Test Goal',
        description: 'Test Description',
      startDate: expect.any(Date),
      targetDate: expect.any(Date),
        targetValue: 100,
      unit: 'kg'
    });
  });

     it('should handle create goal failure with correct message', async () => {
            mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Invalid input' } } });
       const { createGoal } = goalService();
      const startDate = new Date();
        const targetDate = new Date();
      await expect(createGoal('user-id', 'Test Goal', 'Test Description', startDate, targetDate, 100, 'kg')).rejects.toThrow('Failed to create goal: Invalid input');
     });


  it('should handle create goal failure with generic message when message is not provided', async () => {
      mockMakeRequest.mockRejectedValue(new Error());
      const { createGoal } = goalService();
      const startDate = new Date();
      const targetDate = new Date();
       await expect(createGoal('user-id', 'Test Goal', 'Test Description', startDate, targetDate, 100, 'kg')).rejects.toThrow('Failed to create goal: Internal server error');
    });



  it('should get goals successfully with userId', async () => {
       mockMakeRequest.mockResolvedValue([{ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: new Date(), targetDate: new Date(), targetValue: 100, unit: 'kg' }]);
    const { getGoals } = goalService();
    const response = await getGoals('user-id');
    expect(mockMakeRequest).toHaveBeenCalledWith({
        url: '/api/goals',
      method: 'GET',
      params: { userId: 'user-id' },
      headers: { 'Content-Type': 'application/json' },
    });

        expect(response).toEqual([{ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: expect.any(Date), targetDate: expect.any(Date), targetValue: 100, unit: 'kg' }]);
  });


    it('should get goals successfully without userId', async () => {
      mockMakeRequest.mockResolvedValue([{ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: new Date(), targetDate: new Date(), targetValue: 100, unit: 'kg' }]);
       const { getGoals } = goalService();
        const response = await getGoals();
        expect(mockMakeRequest).toHaveBeenCalledWith({
            url: '/api/goals',
            method: 'GET',
            params: { userId: undefined },
            headers: { 'Content-Type': 'application/json' },
    });

         expect(response).toEqual([{ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: expect.any(Date), targetDate: expect.any(Date), targetValue: 100, unit: 'kg' }]);
     });


  it('should handle get goals failure with correct message', async () => {
       mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Failed to fetch goals' } } });
    const { getGoals } = goalService();
      await expect(getGoals('user-id')).rejects.toThrow('Failed to fetch goals: Failed to fetch goals');
  });


   it('should handle get goals failure with generic message when message is not provided', async () => {
     mockMakeRequest.mockRejectedValue(new Error());
    const { getGoals } = goalService();
     await expect(getGoals('user-id')).rejects.toThrow('Failed to fetch goals: Internal server error');
    });

    it('should get goal by id successfully', async () => {
         mockMakeRequest.mockResolvedValue({ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: new Date(), targetDate: new Date(), targetValue: 100, unit: 'kg' });
        const { getGoalById } = goalService();
         const response = await getGoalById('goal-id');
        expect(mockMakeRequest).toHaveBeenCalledWith({
            url: '/api/goals/goal-id',
            method: 'GET',
               headers: { 'Content-Type': 'application/json' },
    });
       expect(response).toEqual({ id: 'goal-id', name: 'Test Goal', description: 'Test Description', startDate: expect.any(Date), targetDate: expect.any(Date), targetValue: 100, unit: 'kg' });
     });


    it('should handle get goal by id failure with correct message', async () => {
        mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Goal not found' } } });
        const { getGoalById } = goalService();
        await expect(getGoalById('goal-id')).rejects.toThrow('Failed to fetch goal: Goal not found');
    });


   it('should handle get goal by id failure with generic message when message is not provided', async () => {
    mockMakeRequest.mockRejectedValue(new Error());
    const { getGoalById } = goalService();
      await expect(getGoalById('goal-id')).rejects.toThrow('Failed to fetch goal: Internal server error');
    });

    it('should update a goal successfully', async () => {
         mockMakeRequest.mockResolvedValue({ id: 'goal-id', name: 'Updated Goal', description: 'Updated Description', startDate: new Date(), targetDate: new Date(), targetValue: 200, unit: 'lbs' });
        const { updateGoal } = goalService();
        const startDate = new Date();
        const targetDate = new Date();
        const response = await updateGoal('goal-id', 'Updated Goal', 'Updated Description', startDate, targetDate, 200, 'lbs');

        expect(mockMakeRequest).toHaveBeenCalledWith({
            url: '/api/goals/goal-id',
          method: 'PUT',
            data: {
              name: 'Updated Goal',
                description: 'Updated Description',
              startDate: startDate,
                targetDate: targetDate,
                targetValue: 200,
                unit: 'lbs',
            },
             headers: { 'Content-Type': 'application/json' },
        });
        expect(response).toEqual({ id: 'goal-id', name: 'Updated Goal', description: 'Updated Description', startDate: expect.any(Date), targetDate: expect.any(Date), targetValue: 200, unit: 'lbs' });
     });


  it('should handle update goal failure with correct message', async () => {
       mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Goal not found' } } });
    const { updateGoal } = goalService();
       const startDate = new Date();
        const targetDate = new Date();
    await expect(updateGoal('goal-id', 'Updated Goal', 'Updated Description', startDate, targetDate, 200, 'lbs')).rejects.toThrow('Failed to update goal: Goal not found');
    });


   it('should handle update goal failure with generic message when message is not provided', async () => {
       mockMakeRequest.mockRejectedValue(new Error());
    const { updateGoal } = goalService();
        const startDate = new Date();
        const targetDate = new Date();
      await expect(updateGoal('goal-id', 'Updated Goal', 'Updated Description', startDate, targetDate, 200, 'lbs')).rejects.toThrow('Failed to update goal: Internal server error');
    });


  it('should delete a goal successfully', async () => {
        mockMakeRequest.mockResolvedValue(undefined);
    const { deleteGoal } = goalService();
      const response = await deleteGoal('goal-id');
      expect(mockMakeRequest).toHaveBeenCalledWith({
          url: '/api/goals/goal-id',
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
    });
        expect(response).toBeUndefined();
  });


  it('should handle delete goal failure with correct message', async () => {
        mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Goal not found' } } });
    const { deleteGoal } = goalService();
    await expect(deleteGoal('goal-id')).rejects.toThrow('Failed to delete goal: Goal not found');
    });


   it('should handle delete goal failure with generic message when message is not provided', async () => {
     mockMakeRequest.mockRejectedValue(new Error());
    const { deleteGoal } = goalService();
       await expect(deleteGoal('goal-id')).rejects.toThrow('Failed to delete goal: Internal server error');
   });
});



describe('Progress Service', () => {
      const mockedAxios = axios;
      const mockMakeRequest = jest.fn();

    beforeEach(() => {
         jest.clearAllMocks();
        useApi.mockReturnValue({ makeRequest: mockMakeRequest });
         jest.spyOn(localStorage, 'setItem').mockReturnValue();
         jest.spyOn(localStorage, 'removeItem').mockReturnValue();
    });

  it('should create a progress entry successfully', async () => {
        mockMakeRequest.mockResolvedValue({id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: new Date(), value: 50});
      const { createProgress } = progressService();
      const date = new Date();
    const response = await createProgress('user-id', 'goal-id', date, 50);

        expect(mockMakeRequest).toHaveBeenCalledWith({
            url: '/api/progress',
            method: 'POST',
            data: {
                userId: 'user-id',
                goalId: 'goal-id',
                date: date,
                value: 50,
            },
           headers: { 'Content-Type': 'application/json' },
      });
      expect(response).toEqual({ id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: expect.any(Date), value: 50});
  });

     it('should handle create progress failure with correct message', async () => {
          mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Invalid input' } } });
      const { createProgress } = progressService();
         const date = new Date();
       await expect(createProgress('user-id', 'goal-id', date, 50)).rejects.toThrow('Failed to create progress: Invalid input');
    });

     it('should handle create progress failure with generic message when message is not provided', async () => {
        mockMakeRequest.mockRejectedValue(new Error());
    const { createProgress } = progressService();
       const date = new Date();
        await expect(createProgress('user-id', 'goal-id', date, 50)).rejects.toThrow('Failed to create progress: Internal server error');
    });


  it('should get progresses successfully with userId', async () => {
      mockMakeRequest.mockResolvedValue([{id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: new Date(), value: 50}]);
    const { getProgresses } = progressService();
      const response = await getProgresses('user-id');
    expect(mockMakeRequest).toHaveBeenCalledWith({
        url: '/api/progress',
        method: 'GET',
        params: { userId: 'user-id' },
            headers: { 'Content-Type': 'application/json' },
    });

     expect(response).toEqual([{ id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: expect.any(Date), value: 50}]);
  });


    it('should get progresses successfully without userId', async () => {
        mockMakeRequest.mockResolvedValue([{id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: new Date(), value: 50}]);
        const { getProgresses } = progressService();
        const response = await getProgresses();
        expect(mockMakeRequest).toHaveBeenCalledWith({
            url: '/api/progress',
            method: 'GET',
              params: {},
             headers: { 'Content-Type': 'application/json' },
    });
      expect(response).toEqual([{id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: expect.any(Date), value: 50}]);
   });

  it('should handle get progresses failure with correct message', async () => {
     mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Failed to fetch progresses' } } });
    const { getProgresses } = progressService();
      await expect(getProgresses('user-id')).rejects.toThrow('Failed to fetch progresses: Failed to fetch progresses');
  });


     it('should handle get progresses failure with generic message when message is not provided', async () => {
          mockMakeRequest.mockRejectedValue(new Error());
    const { getProgresses } = progressService();
      await expect(getProgresses('user-id')).rejects.toThrow('Failed to fetch progresses: Internal server error');
    });

    it('should get progress by id successfully', async () => {
         mockMakeRequest.mockResolvedValue({id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: new Date(), value: 50});
        const { getProgressById } = progressService();
        const response = await getProgressById('progress-id');
        expect(mockMakeRequest).toHaveBeenCalledWith({
            url: '/api/progress/progress-id',
          method: 'GET',
             headers: { 'Content-Type': 'application/json' },
        });
           expect(response).toEqual({id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: expect.any(Date), value: 50});
     });


    it('should handle get progress by id failure with correct message', async () => {
          mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Progress not found' } } });
      const { getProgressById } = progressService();
      await expect(getProgressById('progress-id')).rejects.toThrow('Failed to fetch progress: Progress not found');
    });


     it('should handle get progress by id failure with generic message when message is not provided', async () => {
         mockMakeRequest.mockRejectedValue(new Error());
        const { getProgressById } = progressService();
       await expect(getProgressById('progress-id')).rejects.toThrow('Failed to fetch progress: Internal server error');
   });

    it('should update a progress entry successfully', async () => {
         mockMakeRequest.mockResolvedValue({id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: new Date(), value: 75});
        const { updateProgress } = progressService();
        const date = new Date();
    const response = await updateProgress('progress-id', date, 75);
        expect(mockMakeRequest).toHaveBeenCalledWith({
           url: '/api/progress/progress-id',
            method: 'PUT',
             data: {
              date: date,
              value: 75,
            },
            headers: { 'Content-Type': 'application/json' },
      });
       expect(response).toEqual({id: 'progress-id', userId: 'user-id', goalId: 'goal-id', date: expect.any(Date), value: 75});
   });

   it('should handle update progress failure with correct message', async () => {
       mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Progress not found' } } });
    const { updateProgress } = progressService();
       const date = new Date();
     await expect(updateProgress('progress-id', date, 75)).rejects.toThrow('Failed to update progress: Progress not found');
  });


    it('should handle update progress failure with generic message when message is not provided', async () => {
         mockMakeRequest.mockRejectedValue(new Error());
        const { updateProgress } = progressService();
        const date = new Date();
     await expect(updateProgress('progress-id', date, 75)).rejects.toThrow('Failed to update progress: Internal server error');
    });


  it('should delete a progress entry successfully', async () => {
      mockMakeRequest.mockResolvedValue(undefined);
    const { deleteProgress } = progressService();
     const response =  await deleteProgress('progress-id');
      expect(mockMakeRequest).toHaveBeenCalledWith({
          url: '/api/progress/progress-id',
          method: 'DELETE',
             headers: { 'Content-Type': 'application/json' },
    });
         expect(response).toBeUndefined();
  });


  it('should handle delete progress failure with correct message', async () => {
      mockMakeRequest.mockRejectedValue({ response: { data: { message: 'Progress not found' } } });
    const { deleteProgress } = progressService();
      await expect(deleteProgress('progress-id')).rejects.toThrow('Failed to delete progress: Progress not found');
  });


   it('should handle delete progress failure with generic message when message is not provided', async () => {
    mockMakeRequest.mockRejectedValue(new Error());
    const { deleteProgress } = progressService();
      await expect(deleteProgress('progress-id')).rejects.toThrow('Failed to delete progress: Internal server error');
  });
});
