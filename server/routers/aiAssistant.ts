import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { invokeLLM } from '../_core/llm';

export const aiAssistantRouter = router({
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Adicionar contexto do usuário
        const systemPrompt = {
          role: 'system' as const,
          content: `Você é um especialista em pecuária e agronegócio, especializado em IA para gestão de rebanho leiteiro. 
Você ajuda fazendeiros com:
- Manejo de rebanho (alimentação, vacinação, reprodução)
- Análise de dados de produção
- Prevenção de doenças
- Otimização de custos
- Bem-estar animal
- Sustentabilidade

Sempre forneça respostas práticas e baseadas em dados. Se não tiver informação específica, sugira consultar um veterinário.
Responda em português do Brasil.`,
        };

        const messages = [
          systemPrompt,
          ...input.messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
          })),
        ];

        const response = await invokeLLM({
          messages,
        });

        const assistantMessage = response.choices[0]?.message?.content;

        if (typeof assistantMessage !== 'string') {
          throw new Error('Invalid response from LLM');
        }

        return {
          success: true,
          message: assistantMessage,
          usage: response.usage,
        };
      } catch (error) {
        console.error('AI Assistant error:', error);
        throw new Error(
          `Erro ao processar sua pergunta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        );
      }
    }),

  // Análise de rebanho com IA
  analyzeHerd: protectedProcedure
    .input(
      z.object({
        herdStats: z.object({
          totalAnimals: z.number(),
          averageWeight: z.number(),
          averageProduction: z.number(),
          healthAlerts: z.number(),
          lastVaccination: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de rebanho leiteiro. Analise os dados fornecidos e forneça recomendações.',
            },
            {
              role: 'user',
              content: `Analise meu rebanho com os seguintes dados:
- Total de animais: ${input.herdStats.totalAnimals}
- Peso médio: ${input.herdStats.averageWeight} kg
- Produção média: ${input.herdStats.averageProduction} L/dia
- Alertas de saúde: ${input.herdStats.healthAlerts}
- Última vacinação: ${input.herdStats.lastVaccination || 'Não informado'}

Forneça uma análise detalhada e recomendações de ação.`,
            },
          ],
        });

        const analysis = response.choices[0]?.message?.content;

        if (typeof analysis !== 'string') {
          throw new Error('Invalid response from LLM');
        }

        return {
          success: true,
          analysis,
        };
      } catch (error) {
        console.error('Herd analysis error:', error);
        throw new Error('Erro ao analisar rebanho');
      }
    }),

  // Recomendações nutricionais com IA
  getNutritionRecommendations: protectedProcedure
    .input(
      z.object({
        animalWeight: z.number(),
        productionLevel: z.enum(['baixa', 'média', 'alta']),
        currentFeed: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um nutricionista especializado em bovinos leiteiros. Forneça recomendações nutricionais baseadas nos dados fornecidos.',
            },
            {
              role: 'user',
              content: `Forneça recomendações nutricionais para:
- Peso do animal: ${input.animalWeight} kg
- Nível de produção: ${input.productionLevel}
- Alimentação atual: ${input.currentFeed || 'Não informado'}

Inclua: proteína, fibra, minerais, vitaminas e custo estimado.`,
            },
          ],
        });

        const recommendations = response.choices[0]?.message?.content;

        if (typeof recommendations !== 'string') {
          throw new Error('Invalid response from LLM');
        }

        return {
          success: true,
          recommendations,
        };
      } catch (error) {
        console.error('Nutrition recommendations error:', error);
        throw new Error('Erro ao gerar recomendações nutricionais');
      }
    }),

  // Diagnóstico de saúde com IA
  getHealthDiagnosis: protectedProcedure
    .input(
      z.object({
        symptoms: z.string(),
        temperature: z.number().optional(),
        weight: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um veterinário especializado em bovinos. Analise os sintomas fornecidos e forneça possíveis diagnósticos e recomendações.
IMPORTANTE: Sempre recomende consulta com veterinário para diagnóstico definitivo.`,
            },
            {
              role: 'user',
              content: `Analise os seguintes sintomas:
- Sintomas: ${input.symptoms}
${input.temperature ? `- Temperatura: ${input.temperature}°C` : ''}
${input.weight ? `- Peso: ${input.weight} kg` : ''}

Forneça possíveis diagnósticos e recomendações de ação.`,
            },
          ],
        });

        const diagnosis = response.choices[0]?.message?.content;

        if (typeof diagnosis !== 'string') {
          throw new Error('Invalid response from LLM');
        }

        return {
          success: true,
          diagnosis,
        };
      } catch (error) {
        console.error('Health diagnosis error:', error);
        throw new Error('Erro ao gerar diagnóstico');
      }
    }),
});
