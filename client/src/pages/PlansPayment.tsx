import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Download, QrCode, CreditCard } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useNotifications } from '@/hooks/useNotifications';

const PlansPayment = () => {
  const { success, error } = useNotifications();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto'>('pix');
  const [showQrCode, setShowQrCode] = useState(false);

  const plansQuery = trpc.payments.getPlans.useQuery();
  const pixMutation = trpc.payments.generatePixQrCode.useMutation();
  const boletoMutation = trpc.payments.generateBoleto.useMutation();

  const handleGeneratePix = async () => {
    if (!selectedPlan) return;

    try {
      const plan = plansQuery.data?.plans.find((p) => p.id === selectedPlan);
      if (!plan) return;

      await pixMutation.mutateAsync({
        planId: selectedPlan,
        amount: plan.price,
        description: `Assinatura BOVISION - ${plan.name}`,
      });

      setShowQrCode(true);
      success('PIX Gerado', 'QR Code PIX gerado com sucesso! Escaneie para pagar.');
    } catch (err) {
      error('Erro', err instanceof Error ? err.message : 'Erro ao gerar PIX');
    }
  };

  const handleGenerateBoleto = async () => {
    if (!selectedPlan) return;

    try {
      const plan = plansQuery.data?.plans.find((p) => p.id === selectedPlan);
      if (!plan) return;

      const result = await boletoMutation.mutateAsync({
        planId: selectedPlan,
        amount: plan.price,
      });

      success('Boleto Gerado', 'Boleto gerado com sucesso! Clique para baixar.');
    } catch (err) {
      error('Erro', err instanceof Error ? err.message : 'Erro ao gerar boleto');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    success('Copiado', 'Chave PIX copiada para a área de transferência');
  };

  if (plansQuery.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-accent animate-pulse">Carregando planos...</div>
      </div>
    );
  }

  const plans = plansQuery.data?.plans || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur border-b border-accent/20 px-4 sm:px-6 py-6"
      >
        <h1 className="text-3xl font-bold">
          <span className="text-accent">Planos</span>
          <span className="text-cyan-400"> e Pagamento</span>
        </h1>
        <p className="text-gray-400 mt-2">Escolha o plano ideal para sua fazenda</p>
      </motion.div>

      {/* Plans Grid */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-6 rounded-lg border cursor-pointer transition ${
                selectedPlan === plan.id
                  ? 'bg-accent/20 border-accent/60'
                  : 'bg-black/50 border-accent/20 hover:border-accent/40'
              }`}
            >
              <h3 className="text-xl font-bold text-accent">{plan.name}</h3>
              <p className="text-sm text-gray-400 mt-2">{plan.description}</p>

              {plan.price > 0 ? (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-cyan-400">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-400">/mês</span>
                </div>
              ) : (
                <div className="mt-4 text-lg font-bold text-lime-400">Gratuito</div>
              )}

              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-lime-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Payment Section */}
        {selectedPlan && selectedPlan !== 'trial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 border border-accent/20 rounded-lg p-6 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-accent">Método de</span>
              <span className="text-cyan-400"> Pagamento</span>
            </h2>

            {/* Payment Method Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setPaymentMethod('pix');
                  setShowQrCode(false);
                }}
                className={`flex-1 p-4 rounded-lg border transition ${
                  paymentMethod === 'pix'
                    ? 'bg-accent/20 border-accent/60'
                    : 'bg-black/50 border-accent/20 hover:border-accent/40'
                }`}
              >
                <QrCode size={24} className="mx-auto mb-2" />
                <span className="font-bold">PIX</span>
              </button>
              <button
                onClick={() => {
                  setPaymentMethod('boleto');
                  setShowQrCode(false);
                }}
                className={`flex-1 p-4 rounded-lg border transition ${
                  paymentMethod === 'boleto'
                    ? 'bg-accent/20 border-accent/60'
                    : 'bg-black/50 border-accent/20 hover:border-accent/40'
                }`}
              >
                <CreditCard size={24} className="mx-auto mb-2" />
                <span className="font-bold">Boleto</span>
              </button>
            </div>

            {/* PIX Section */}
            {paymentMethod === 'pix' && (
              <div className="space-y-4">
                {!showQrCode ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGeneratePix}
                    disabled={pixMutation.isPending}
                    className="w-full p-4 bg-gradient-to-r from-accent to-cyan-400 text-black rounded-lg font-bold hover:shadow-lg hover:shadow-accent/50 transition disabled:opacity-50"
                  >
                    {pixMutation.isPending ? 'Gerando...' : 'Gerar QR Code PIX'}
                  </motion.button>
                ) : pixMutation.data ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                      <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                        <QrCode size={64} className="text-gray-400" />
                      </div>
                    </div>

                    <div className="bg-black/50 border border-accent/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">Chave PIX (Copia e Cola):</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pixMutation.data.pixKey}
                          readOnly
                          className="flex-1 bg-black/50 border border-accent/30 rounded px-3 py-2 text-sm text-white"
                        />
                        <button
                          onClick={() => copyToClipboard(pixMutation.data.pixKey)}
                          className="p-2 bg-accent/20 border border-accent/40 rounded hover:bg-accent/30 transition"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 text-center">
                      Válido por 30 minutos
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Boleto Section */}
            {paymentMethod === 'boleto' && (
              <div className="space-y-4">
                {!boletoMutation.data ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateBoleto}
                    disabled={boletoMutation.isPending}
                    className="w-full p-4 bg-gradient-to-r from-accent to-cyan-400 text-black rounded-lg font-bold hover:shadow-lg hover:shadow-accent/50 transition disabled:opacity-50"
                  >
                    {boletoMutation.isPending ? 'Gerando...' : 'Gerar Boleto'}
                  </motion.button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/50 border border-accent/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">Número do Boleto:</p>
                      <p className="font-mono text-lg text-accent">
                        {boletoMutation.data.boletoNumber}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full p-4 bg-accent/20 border border-accent/40 rounded-lg font-bold hover:bg-accent/30 transition flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Baixar Boleto em PDF
                    </motion.button>

                    <p className="text-sm text-gray-400 text-center">
                      Válido até {new Date(boletoMutation.data.dueDate).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Trial Plan Message */}
        {selectedPlan === 'trial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-6 max-w-2xl mx-auto text-center"
          >
            <h3 className="text-xl font-bold text-lime-400 mb-2">
              Trial Gratuito Ativado!
            </h3>
            <p className="text-gray-300">
              Você tem 30 dias de acesso completo a todas as funcionalidades. Aproveite!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlansPayment;
