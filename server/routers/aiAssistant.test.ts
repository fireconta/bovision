import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiAssistantRouter } from './aiAssistant';
import * as llmModule from '../_core/llm';

// Mock invokeLLM
vi.mock('../_core/llm', () => ({
  invokeLLM: vi.fn(),
}));

describe('aiAssistantRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('chat procedure', () => {
    it('should return success with a message from LLM', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Resposta da IA sobre seu rebanho',
            },
          },
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150,
        },
      };

      vi.mocked(llmModule.invokeLLM).mockResolvedValueOnce(mockResponse as any);

      const caller = aiAssistantRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.chat({
        messages: [
          {
            role: 'user',
            content: 'Como melhorar a produção de leite?',
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Resposta da IA sobre seu rebanho');
      expect(result.usage).toEqual({
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      });
    });

    it('should throw error if LLM returns invalid response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null, // Invalid
            },
          },
        ],
      };

      vi.mocked(llmModule.invokeLLM).mockResolvedValueOnce(mockResponse as any);

      const caller = aiAssistantRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      await expect(
        caller.chat({
          messages: [
            {
              role: 'user',
              content: 'Como melhorar a produção de leite?',
            },
          ],
        })
      ).rejects.toThrow('Invalid response from LLM');
    });

    it('should handle LLM errors gracefully', async () => {
      vi.mocked(llmModule.invokeLLM).mockRejectedValueOnce(
        new Error('API Error')
      );

      const caller = aiAssistantRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      await expect(
        caller.chat({
          messages: [
            {
              role: 'user',
              content: 'Como melhorar a produção de leite?',
            },
          ],
        })
      ).rejects.toThrow('Erro ao processar sua pergunta');
    });
  });

  describe('analyzeHerd procedure', () => {
    it('should return analysis with herd stats', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Análise detalhada do rebanho com recomendações',
            },
          },
        ],
      };

      vi.mocked(llmModule.invokeLLM).mockResolvedValueOnce(mockResponse as any);

      const caller = aiAssistantRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.analyzeHerd({
        herdStats: {
          totalAnimals: 100,
          averageWeight: 500,
          averageProduction: 25,
          healthAlerts: 2,
          lastVaccination: '2026-05-01',
        },
      });

      expect(result.success).toBe(true);
      expect(result.analysis).toBe('Análise detalhada do rebanho com recomendações');
    });
  });

  describe('getNutritionRecommendations procedure', () => {
    it('should return nutrition recommendations', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Recomendações nutricionais personalizadas',
            },
          },
        ],
      };

      vi.mocked(llmModule.invokeLLM).mockResolvedValueOnce(mockResponse as any);

      const caller = aiAssistantRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.getNutritionRecommendations({
        animalWeight: 500,
        productionLevel: 'alta',
        currentFeed: 'Silagem de milho',
      });

      expect(result.success).toBe(true);
      expect(result.recommendations).toBe('Recomendações nutricionais personalizadas');
    });
  });

  describe('getHealthDiagnosis procedure', () => {
    it('should return health diagnosis', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Possível diagnóstico e recomendações',
            },
          },
        ],
      };

      vi.mocked(llmModule.invokeLLM).mockResolvedValueOnce(mockResponse as any);

      const caller = aiAssistantRouter.createCaller({
        user: { id: 'test-user' },
      } as any);

      const result = await caller.getHealthDiagnosis({
        symptoms: 'Febre e redução de produção',
        temperature: 39.5,
        weight: 480,
      });

      expect(result.success).toBe(true);
      expect(result.diagnosis).toBe('Possível diagnóstico e recomendações');
    });
  });
});
