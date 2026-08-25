const request = require('supertest');

// Mock Prisma DB để test độc lập
const mockUsersMap = new Map();

jest.mock('../src/config/db', () => ({
  user: {
    findUnique: jest.fn(async ({ where }) => {
      if (where.email) return mockUsersMap.get(where.email) || null;
      if (where.id) {
        for (const u of mockUsersMap.values()) {
          if (u.id === where.id) return u;
        }
      }
      return null;
    }),
    findFirst: jest.fn(async () => null),
    count: jest.fn(async () => mockUsersMap.size),
    create: jest.fn(async ({ data, select }) => {
      const user = {
        id: `user_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersMap.set(data.email, user);
      return user;
    }),
    update: jest.fn(async ({ where, data }) => {
      const user = mockUsersMap.get(where.email) || {};
      const updated = { ...user, ...data };
      mockUsersMap.set(where.email || updated.email, updated);
      return updated;
    }),
  },
  refreshToken: {
    create: jest.fn(async ({ data }) => ({ id: 'rt_123', ...data })),
    findUnique: jest.fn(async () => null),
    deleteMany: jest.fn(async () => ({ count: 1 })),
  },
}));

// Mock notification service
jest.mock('../src/modules/notifications/notification.service', () => ({
  notifyAdminsAndMods: jest.fn(async () => {}),
}));

// Mock email service
jest.mock('../src/services/email.service', () => ({
  sendRegisterAlert: jest.fn(async () => {}),
  sendLoginAlert: jest.fn(async () => {}),
  sendNewMemberAlert: jest.fn(async () => {}),
  sendMail: jest.fn(async () => {}),
}));

const app = require('../src/app');

describe('Module Xác Thực (Auth Module Tests)', () => {
  const testEmail = `test_${Date.now()}@langgiaotac.vn`;
  const testPassword = 'Password123@!';

  test('POST /api/auth/register - Đăng ký tài khoản mới thành công', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Người Con Làng Giao Tác',
        email: testEmail,
        password: testPassword,
        hometownGroup: 'TDP 9 Thuận Lộc',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/auth/login - Đăng nhập với mật khẩu đúng thành công', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('POST /api/auth/login - Từ chối khi nhập sai mật khẩu', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'wrong_password_123',
      });

    expect([400, 401]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me - Từ chối khi không có hoặc token sai', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_fake_token_123');

    expect(res.status).toBe(401);
  });
});
