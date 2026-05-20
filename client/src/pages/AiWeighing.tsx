import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Crosshair, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AiWeighing() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [weight, setWeight] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState({
    height: 0,
    width: 0,
    volume: 0,
  });

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Erro ao acessar câmera:', err));
    }
  }, [cameraActive]);

  const handleCapture = async () => {
    setScanning(true);

    // Simular análise de IA
    setTimeout(() => {
      const estimatedWeight = Math.floor(Math.random() * (600 - 400) + 400);
      const estimatedAccuracy = Math.floor(Math.random() * (98 - 85) + 85);

      setWeight(estimatedWeight);
      setAccuracy(estimatedAccuracy);
      setMeasurements({
        height: Math.floor(Math.random() * (180 - 140) + 140),
        width: Math.floor(Math.random() * (120 - 80) + 80),
        volume: Math.floor(Math.random() * (800 - 500) + 500),
      });

      setScanning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold gradient-text">Pesagem por IA</h1>
          <p className="text-sm text-muted-foreground">Análise de peso via câmera com precisão</p>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-background border-border neon-glow overflow-hidden">
              {cameraActive ? (
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corner markers */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-2 border-accent" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-2 border-accent" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-2 border-accent" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-accent" />

                    {/* Center crosshair */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <Crosshair className="w-8 h-8 text-accent" />
                    </motion.div>

                    {/* Scanning lines */}
                    {scanning && (
                      <>
                        <motion.div
                          animate={{ y: ['0%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-b from-accent to-transparent"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 border-2 border-accent/30"
                        />
                      </>
                    )}

                    {/* Info text */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <p className="text-accent text-sm font-bold text-center">
                        {scanning ? 'ANALISANDO...' : 'POSICIONE O ANIMAL'}
                      </p>
                    </div>

                    {/* Measurements display */}
                    {weight !== null && (
                      <div className="absolute bottom-4 left-4 right-4 space-y-2">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-3 gap-2"
                        >
                          <div className="bg-black/80 border border-accent/50 rounded p-2 text-center">
                            <p className="text-xs text-muted-foreground">ALTURA</p>
                            <p className="text-lg font-bold text-accent">{measurements.height}cm</p>
                          </div>
                          <div className="bg-black/80 border border-accent/50 rounded p-2 text-center">
                            <p className="text-xs text-muted-foreground">LARGURA</p>
                            <p className="text-lg font-bold text-accent">{measurements.width}cm</p>
                          </div>
                          <div className="bg-black/80 border border-accent/50 rounded p-2 text-center">
                            <p className="text-xs text-muted-foreground">VOLUME</p>
                            <p className="text-lg font-bold text-accent">{measurements.volume}L</p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-accent/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Câmera desativada</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Controls */}
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setCameraActive(!cameraActive)}
                className="flex-1 bg-accent hover:bg-accent/90 text-background"
              >
                <Camera className="w-4 h-4 mr-2" />
                {cameraActive ? 'Desativar Câmera' : 'Ativar Câmera'}
              </Button>
              <Button
                onClick={handleCapture}
                disabled={!cameraActive || scanning}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-background"
              >
                <Crosshair className="w-4 h-4 mr-2" />
                {scanning ? 'Analisando...' : 'Capturar'}
              </Button>
            </div>
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {weight !== null ? (
              <Card className="p-6 bg-background border-border neon-glow sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold gradient-text">Análise Concluída</h3>
                </div>

                <div className="space-y-6">
                  {/* Main weight */}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">PESO ESTIMADO</p>
                    <p className="text-5xl font-bold gradient-text">{weight}</p>
                    <p className="text-sm text-muted-foreground">kg</p>
                  </div>

                  {/* Accuracy */}
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Precisão da Análise</p>
                      <p className="text-lg font-bold text-accent">{accuracy}%</p>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${accuracy}%` }}
                        transition={{ duration: 1 }}
                        className="bg-gradient-to-r from-accent to-secondary h-full rounded-full"
                      />
                    </div>
                  </div>

                  {/* Measurements */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-muted-foreground">MEDIÇÕES</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-card border border-border rounded p-3">
                        <p className="text-xs text-muted-foreground">Altura</p>
                        <p className="text-lg font-bold">{measurements.height}cm</p>
                      </div>
                      <div className="bg-card border border-border rounded p-3">
                        <p className="text-xs text-muted-foreground">Largura</p>
                        <p className="text-lg font-bold">{measurements.width}cm</p>
                      </div>
                      <div className="bg-card border border-border rounded p-3 col-span-2">
                        <p className="text-xs text-muted-foreground">Volume</p>
                        <p className="text-lg font-bold">{measurements.volume}L</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-background">
                      Salvar Pesagem
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent/10"
                      onClick={() => {
                        setWeight(null);
                        setAccuracy(null);
                      }}
                    >
                      Nova Pesagem
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-background border-border neon-glow">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-bold">Instruções</h3>
                </div>

                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-bold text-foreground mb-1">1. Posicione</p>
                    <p>Coloque o animal dentro do quadro de detecção.</p>
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">2. Alinhe</p>
                    <p>Certifique-se de que o animal está em posição lateral.</p>
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">3. Capture</p>
                    <p>Clique no botão Capturar para iniciar a análise.</p>
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">4. Revise</p>
                    <p>Verifique o peso estimado e salve o resultado.</p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
