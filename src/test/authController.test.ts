// authController.test.js
import { login, logout, refresh } from '../controllers/authController';
import { generateAccessToken, generateRefreshToken, invalidateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils';
import bcrypt from 'bcryptjs';
import Knex from 'knex';
import knexConfig from '../db/knexfile';

jest.mock('bcryptjs');
jest.mock('../utils/tokenUtils');
jest.mock('knex', () => jest.fn(() => ({
  select: jest.fn().mockReturnValue([{ username: 'testuser', password: 'hashedPassword' }]),
  where: jest.fn().mockReturnThis(),
})));

describe('authController', () => {
  let mockRequest : any, mockResponse : any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access and refresh tokens for valid credentials', async () => {
      bcrypt.compare.mockResolvedValue(true);
      generateAccessToken.mockReturnValue('accessToken');
      generateRefreshToken.mockReturnValue('refreshToken');

      mockRequest.body = { username: 'testuser', password: 'validPassword' };

      await login(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });

    it('should return 401 for invalid credentials', async () => {
      bcrypt.compare.mockResolvedValue(false);

      mockRequest.body = { username: 'testuser', password: 'invalidPassword' };

      await login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith('Username or password incorrect');
    });

    it('should return 401 for non-existent user', async () => {
      const mockKnex = Knex(knexConfig);
      mockKnex.select.mockReturnValue([]);

      mockRequest.body = { username: 'nonexistentuser', password: 'password' };

      await login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith('Username or password incorrect');
    });

    it('should return 500 for internal server error', async () => {
      const mockError = new Error('Internal server error');
      const mockKnex = Knex(knexConfig);
      mockKnex.select.mockRejectedValue(mockError);

      mockRequest.body = { username: 'testuser', password: 'validPassword' };

      await login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Internal server error');
    });
  });

  describe('logout', () => {
    it('should invalidate the refresh token and return 204', () => {
      invalidateRefreshToken.mockReturnValue();

      mockRequest.body = { token: 'refreshToken' };

      logout(mockRequest, mockResponse);

      expect(invalidateRefreshToken).toHaveBeenCalledWith('refreshToken');
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe('refresh', () => {
    it('should return a new access token for a valid refresh token', () => {
      verifyRefreshToken.mockReturnValue({ username: 'testuser' });
      generateAccessToken.mockReturnValue('newAccessToken');

      mockRequest.body = { token: 'validRefreshToken' };

      refresh(mockRequest, mockResponse);

      expect(verifyRefreshToken).toHaveBeenCalledWith('validRefreshToken');
      expect(generateAccessToken).toHaveBeenCalledWith({ username: 'testuser' });
      expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: 'newAccessToken' });
    });

    it('should return 403 for an invalid refresh token', () => {
      verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid refresh token');
      });

      mockRequest.body = { token: 'invalidRefreshToken' };

      refresh(mockRequest, mockResponse);

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });
});
