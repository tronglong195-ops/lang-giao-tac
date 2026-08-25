const request = require('supertest');

// Mock Prisma DB cho authGuard
const mockUser = {
  id: 'test-user-id',
  fullName: 'Thành Viên Test',
  email: 'test@langgiaotac.vn',
  role: 'member',
  isVerified: true,
};

jest.mock('../src/config/db', () => ({
  user: {
    findUnique: jest.fn(async ({ where }) => {
      if (where.id === 'test-user-id' || where.email === 'test@langgiaotac.vn') {
        return mockUser;
      }
      return null;
    }),
  },
}));

const { generateAccessToken } = require('../src/utils/jwt');
const app = require('../src/app');

describe('Module Tải Ảnh (Upload Module Tests)', () => {
  let validToken = '';

  beforeAll(() => {
    validToken = generateAccessToken(mockUser);
  });

  test('POST /api/upload/image - Từ chối khi thiếu token xác thực', async () => {
    const res = await request(app)
      .post('/api/upload/image')
      .send({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' });

    expect(res.status).toBe(401);
  });

  test('POST /api/upload/image - Từ chối file không phải định dạng hình ảnh (text/html/pdf/exe)', async () => {
    const res = await request(app)
      .post('/api/upload/image')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ image: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDw...' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('hình ảnh');
  });

  test('POST /api/upload/image - Chấp nhận định dạng ảnh hợp lệ (data:image/png)', async () => {
    const res = await request(app)
      .post('/api/upload/image')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        folder: 'test_folder',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.imageUrl).toBeDefined();
  });
});
