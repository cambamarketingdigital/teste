import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consultant');
  const [accessCode, setAccessCode] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  
  // PIX fields
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('cpf');
  
  // Bank fields
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountBranch, setAccountBranch] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountHolderDocument, setAccountHolderDocument] = useState('');

  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const togglePaymentMethod = (method: string) => {
    setSelectedPaymentMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      }
      return [...prev, method];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentMethods = selectedPaymentMethods.map(method => {
      if (method === 'pix') {
        return {
          type: 'pix',
          pixKey,
          pixKeyType,
          isDefault: selectedPaymentMethods[0] === 'pix'
        };
      }
      return {
        type: 'bank',
        bankName,
        bankCode,
        accountType,
        accountNumber,
        accountBranch,
        accountHolder,
        accountHolderDocument,
        isDefault: selectedPaymentMethods[0] === 'bank'
      };
    });

    try {
      await register(email, password, name, role, accessCode, undefined, undefined, undefined, paymentMethods);
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">Cadastro</h2>
              <p className="mt-1 text-sm text-secondary-500">
                Preencha os dados para criar sua conta
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Select
                label="Função"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: 'consultant', label: 'Consultor' },
                  { value: 'director', label: 'Diretor' }
                ]}
              />

              <Input
                label="Código de acesso"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
              />

              <div className="space-y-4">
                <label className="block text-sm font-medium text-secondary-700">
                  Métodos de Pagamento (selecione um ou mais)
                </label>
                
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={selectedPaymentMethods.includes('pix') ? 'primary' : 'outline'}
                    onClick={() => togglePaymentMethod('pix')}
                  >
                    PIX
                  </Button>
                  <Button
                    type="button"
                    variant={selectedPaymentMethods.includes('bank') ? 'primary' : 'outline'}
                    onClick={() => togglePaymentMethod('bank')}
                  >
                    Dados Bancários
                  </Button>
                </div>

                {selectedPaymentMethods.includes('pix') && (
                  <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
                    <h3 className="font-medium text-secondary-900">Dados do PIX</h3>
                    <Select
                      label="Tipo de Chave PIX"
                      value={pixKeyType}
                      onChange={(e) => setPixKeyType(e.target.value)}
                      options={[
                        { value: 'cpf', label: 'CPF' },
                        { value: 'cnpj', label: 'CNPJ' },
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Telefone' },
                        { value: 'random', label: 'Chave Aleatória' }
                      ]}
                    />
                    <Input
                      label="Chave PIX"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      required={selectedPaymentMethods.includes('pix')}
                    />
                  </div>
                )}

                {selectedPaymentMethods.includes('bank') && (
                  <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
                    <h3 className="font-medium text-secondary-900">Dados Bancários</h3>
                    <Input
                      label="Nome do Banco"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required={selectedPaymentMethods.includes('bank')}
                    />
                    <Input
                      label="Código do Banco"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      required={selectedPaymentMethods.includes('bank')}
                    />
                    <Select
                      label="Tipo de Conta"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      options={[
                        { value: 'checking', label: 'Conta Corrente' },
                        { value: 'savings', label: 'Conta Poupança' }
                      ]}
                    />
                    <Input
                      label="Número da Conta"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required={selectedPaymentMethods.includes('bank')}
                    />
                    <Input
                      label="Agência"
                      value={accountBranch}
                      onChange={(e) => setAccountBranch(e.target.value)}
                      required={selectedPaymentMethods.includes('bank')}
                    />
                    <Input
                      label="Nome do Titular"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      required={selectedPaymentMethods.includes('bank')}
                    />
                    <Input
                      label="CPF/CNPJ do Titular"
                      value={accountHolderDocument}
                      onChange={(e) => setAccountHolderDocument(e.target.value)}
                      required={selectedPaymentMethods.includes('bank')}
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-error-50 text-error-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Voltar para Login
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={selectedPaymentMethods.length === 0}
              >
                Criar Conta
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;