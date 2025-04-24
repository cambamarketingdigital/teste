import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { ChevronRight, BarChart4, Users, TrendingUp, CheckCircle } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <BarChart4 size={32} className="text-primary-500" />,
      title: 'Marketing Digital',
      description: 'Estratégias personalizadas para aumentar sua presença online'
    },
    {
      icon: <Users size={32} className="text-primary-500" />,
      title: 'Gestão de Redes Sociais',
      description: 'Engajamento e crescimento nas principais plataformas'
    },
    {
      icon: <TrendingUp size={32} className="text-primary-500" />,
      title: 'Tráfego Pago',
      description: 'Campanhas otimizadas para maximizar seu ROI'
    }
  ];

  const benefits = [
    'Aumento de visibilidade online',
    'Geração de leads qualificados',
    'Maior engajamento com o público',
    'Resultados mensuráveis',
    'Estratégias personalizadas',
    'Suporte especializado'
  ];

  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-business-team-meeting-in-an-office-4823-large.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Hero Content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-20 h-full flex flex-col items-center justify-center px-4"
            >
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-primary-500 rounded-2xl mx-auto mb-8 flex items-center justify-center"
                >
                  <span className="text-4xl font-bold text-secondary-900">C</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                  Transforme seu Negócio com Marketing Digital
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-xl md:text-2xl text-secondary-200 mb-12"
                >
                  Soluções completas para impulsionar sua presença online e aumentar seus resultados
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="text-lg px-12 py-4"
                    rightIcon={<ChevronRight size={20} />}
                  >
                    Área do Cliente
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-12 py-4 text-white border-white hover:bg-white hover:text-secondary-900"
                    onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Saiba Mais
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-secondary-600">
              Soluções completas para impulsionar seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Por que escolher a Camba?
            </h2>
            <p className="text-xl text-secondary-600">
              Resultados comprovados e experiência no mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <CheckCircle className="text-primary-500 flex-shrink-0" />
                <span className="text-lg text-secondary-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-secondary-900 mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-secondary-800 mb-8">
            Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/login')}
            className="text-lg px-12 py-4"
            rightIcon={<ChevronRight size={20} />}
          >
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Welcome;