const request = require('supertest');

// Mock Prisma DB cho funds test
jest.mock('../src/config/db', () => {
  const campaigns = [
    {
      id: 'camp_123',
      title: 'Quỹ Khuyến Học Làng Giao Tác (Test)',
      slug: 'quy-khuyen-hoc-test',
      description: 'Ủng hộ học sinh giỏi vượt khó',
      targetAmount: 50000000,
      raisedAmount: 5000000,
      qrCodePrefix: 'GIAOTAC',
      _count: { donations: 1 },
    },
  ];

  return {
    fundCampaign: {
      findMany: jest.fn(async () => campaigns),
      findUnique: jest.fn(async ({ where }) => campaigns.find((c) => c.id === where.id || c.slug === where.slug) || null),
      create: jest.fn(async ({ data }) => ({ id: `camp_${Date.now()}`, ...data })),
      update: jest.fn(async ({ where, data }) => ({ id: where.id, ...data })),
    },
    fundDonation: {
      findMany: jest.fn(async () => []),
      findFirst: jest.fn(async () => null),
      create: jest.fn(async ({ data }) => ({
        id: `donation_${Date.now()}`,
        ...data,
        createdAt: new Date(),
      })),
      update: jest.fn(async ({ where, data }) => ({ id: where.id, ...data })),
    },
  };
});

const app = require('../src/app');

describe('Module Quỹ Quê Hương (Funds Module Tests)', () => {
  test('GET /api/funds - Lấy danh sách chiến dịch thành công', async () => {
    const res = await request(app).get('/api/funds');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.campaigns)).toBe(true);
    expect(res.body.data.campaigns.length).toBeGreaterThan(0);
  });

  test('POST /api/funds/donate - Tạo khoản ủng hộ mới thành công và mặc định isVerified = false', async () => {
    const res = await request(app)
      .post('/api/funds/donate')
      .send({
        campaignId: 'camp_123',
        donorName: 'Con Em Xa Quê Test',
        donorClan: 'Họ Nguyễn Trọng',
        amount: 200000,
        message: 'Chúc các cháu học tập tốt!',
        isVerified: true, // Thử cố tình truyền true từ client
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.donation).toBeDefined();
    // User thường KHÔNG được phép tự xác nhận isVerified: true
    expect(res.body.data.donation.isVerified).toBe(false);
  });
});
