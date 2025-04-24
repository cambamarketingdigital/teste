import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BarChart4, ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client');
  const [accessCode, setAccessCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [document, setDocument] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const { login, register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      await register(email, password, name, role, accessCode, companyName, document, whatsapp);
    } else {
      await login(email, password);
    }
    navigate('/');
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen bg-secondary-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-primary-500 text-secondary-900 p-3 rounded-xl shadow-lg">
            <BarChart4 size={32} />
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-3xl font-extrabold text-white"
        >
          Camba Marketing Digital
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-center text-sm text-secondary-400"
        >
          {isRegistering ? 'Crie sua conta para acessar o sistema' : 'Entre com suas credenciais para acessar o sistema'}
        </motion.p>
      </div>
      
      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <motion.div variants={item}>
                  <Input
                    id="name"
                    label="Nome completo"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={item}>
                  <Select
                    label="Tipo de usuário"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={[
                      { value: 'client', label: 'Cliente' },
                      { value: 'consultant', label: 'Consultor' },
                      { value: 'director', label: 'Diretor' },
                      { value: 'financial', label: 'Financeiro' },
                      { value: 'admin', label: 'Administrador' }
                    ]}
                  />
                </motion.div>

                {role === 'client' && (
                  <>
                    <motion.div variants={item}>
                      <Input
                        id="companyName"
                        label="Nome da Empresa"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </motion.div>

                    <motion.div variants={item}>
                      <Input
                        id="document"
                        label="CNPJ ou CPF"
                        type="text"
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        placeholder="00.000.000/0000-00 ou 000.000.000-00"
                        required
                      />
                    </motion.div>

                    <motion.div variants={item}>
                      <Input
                        id="whatsapp"
                        label="WhatsApp"
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </motion.div>
                  </>
                )}

                {role !== 'client' && (
                  <motion.div variants={item}>
                    <Input
                      id="accessCode"
                      label="Código de acesso"
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      required
                      helperText="Necessário para cadastro de consultores, diretores e administradores"
                    />
                  </motion.div>
                )}
              </>
            )}

            <motion.div variants={item}>
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </motion.div>
            
            <motion.div variants={item}>
              <Input
                id="password"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                required
              />
            </motion.div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-md bg-error-50 text-error-600 text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <motion.div variants={item}>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                {isRegistering ? 'Criar conta' : 'Entrar'}
              </Button>
            </motion.div>

            <motion.div variants={item}>
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full flex items-center justify-center text-sm text-secondary-500 hover:text-secondary-700"
              >
                <ArrowLeft size={16} className="mr-1" />
                {isRegistering ? 'Voltar para login' : 'Criar nova conta'}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;