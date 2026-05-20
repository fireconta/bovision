import { describe, it, expect } from 'vitest';
import { paymentsRouter } from './payments';

describe('paymentsRouter', () => {
  describe('getPlans procedure', () => {
    it('should return list of plans', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.getPlans();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.plans)).toBe(true);
      expect(result.plans.length).toBeGreaterThan(0);
    });

    it('should have required plan properties', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.getPlans();
      const plan = result.plans[0];

      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(plan).toHaveProperty('features');
      expect(Array.isArray(plan.features)).toBe(true);
    });

    it('should have trial plan with zero price', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.getPlans();
      const trialPlan = result.plans.find((p) => p.id === 'trial');

      expect(trialPlan).toBeDefined();
      expect(trialPlan?.price).toBe(0);
    });
  });

  describe('generatePixQrCode procedure', () => {
    it('should generate PIX QR code', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.generatePixQrCode({
        planId: 'basic',
        amount: 29.9,
        description: 'Test PIX',
      });

      expect(result.success).toBe(true);
      expect(result.pixKey).toBeDefined();
      expect(result.qrCode).toBeDefined();
      expect(result.amount).toBe(29.9);
      expect(result.expiresAt).toBeDefined();
    });

    it('should reject negative amount', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      await expect(
        caller.generatePixQrCode({
          planId: 'basic',
          amount: -10,
        })
      ).rejects.toThrow();
    });
  });

  describe('generateBoleto procedure', () => {
    it('should generate boleto', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.generateBoleto({
        planId: 'basic',
        amount: 29.9,
      });

      expect(result.success).toBe(true);
      expect(result.boletoNumber).toBeDefined();
      expect(result.barcode).toBeDefined();
      expect(result.amount).toBe(29.9);
      expect(result.dueDate).toBeDefined();
      expect(result.pdfUrl).toBeDefined();
    });

    it('should use custom due date if provided', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const customDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 dias
      const result = await caller.generateBoleto({
        planId: 'basic',
        amount: 79.9,
        dueDate: customDate,
      });

      expect(result.success).toBe(true);
      expect(result.dueDate.getTime()).toBe(customDate.getTime());
    });
  });

  describe('checkPaymentStatus procedure', () => {
    it('should return payment status', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.checkPaymentStatus({
        paymentId: 'payment-123',
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('payment-123');
      expect(['pending', 'completed', 'failed', 'expired']).toContain(result.status);
      expect(result.amount).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });
  });

  describe('processPaymentWebhook procedure', () => {
    it('should process completed payment webhook', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.processPaymentWebhook({
        paymentId: 'payment-123',
        status: 'completed',
        amount: 29.9,
        planId: 'basic',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
    });

    it('should process failed payment webhook', async () => {
      const caller = paymentsRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.processPaymentWebhook({
        paymentId: 'payment-456',
        status: 'failed',
        amount: 29.9,
        planId: 'basic',
      });

      expect(result.success).toBe(true);
    });
  });
});
