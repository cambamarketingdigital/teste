import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { UserPlus, Download, Filter, Search, UserCog, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const Clients: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyValue, setMonthlyValue] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    }
  };

  const handleSubmit = async () => {
    if (!company || !contact || !email || !phone || !monthlyValue || !startDate) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clients')
        .insert([{
          company,
          contact,
          email,
          phone,
          monthly_value: parseFloat(monthlyValue),
          start_date: startDate,
          status: 'active',
          is_first_month: true,
          updated_by: user?.id
        }]);

      if (error) throw error;

      await fetchClients();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCompany('');
    setContact('');
    setEmail('');
    setPhone('');
    setMonthlyValue('');
    setStartDate('');
    setError(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Ativo</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pendente</Badge>;
      case 'inactive':
        return <Badge variant="error" size="sm">Inativo</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.company?.toLowerCase().includes(searchLower) ||
      client.contact?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower)
    );
  });

  // Verifica se o usuário pode adicionar clientes
  const canAddClients = ['admin', 'director', 'consultant', 'client'].includes(user?.role || '');

  return (
    <div className="pb-6">
      <PageHeader 
        title="Clientes"
        subtitle="Gerencie seus clientes e contratos"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Filter size={16} />}
            >
              Filtrar
            </Button>
            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
            >
              Exportar
            </Button>
            {canAddClients && (
              <Button
                leftIcon={<UserPlus size={16} />}
                onClick={() => setIsModalOpen(true)}
              >
                Novo Cliente
              </Button>
            )}
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total de Clientes</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">{clients.length}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Clientes Ativos</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Receita Mensal</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {formatCurrency(
                  clients
                    .filter(c => c.status === 'active')
                    .reduce((sum, client) => sum + (client.monthly_value || 0), 0)
                )}
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Buscar clientes..."
              leftIcon={<Search size={16} className="text-secondary-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-error-50 rounded-lg flex items-center text-error-600">
              <AlertCircle size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          )}

          <Table hoverable>
            <THead>
              <Tr>
                <Th>Empresa</Th>
                <Th>Contato</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Valor Mensal</Th>
                <Th>Data Início</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredClients.map((client) => (
                <Tr key={client.id}>
                  <Td>{client.company}</Td>
                  <Td>{client.contact}</Td>
                  <Td>{client.email}</Td>
                  <Td>{client.phone}</Td>
                  <Td>{formatCurrency(client.monthly_value)}</Td>
                  <Td>{formatDate(client.start_date)}</Td>
                  <Td>{getStatusBadge(client.status)}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsModalOpen(true);
                        }}
                      >
                        <UserCog size={16} />
                      </Button>
                      {user?.role === 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-error-500 hover:bg-error-50"
                          onClick={() => {
                            setSelectedClient(client);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* Modal de Novo/Editar Cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
          setSelectedClient(null);
        }}
        title={selectedClient ? "Editar Cliente" : "Novo Cliente"}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
                setSelectedClient(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {selectedClient ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome da Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <Input
            label="Nome do Contato"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Input
            label="Valor Mensal"
            type="number"
            value={monthlyValue}
            onChange={(e) => setMonthlyValue(e.target.value)}
            required
          />

          <Input
            label="Data de Início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-error-50 text-error-600 text-sm">
            {error}
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              className="bg-error-500 text-white hover:bg-error-600 border-error-500"
              onClick={async () => {
                if (!selectedClient) return;
                try {
                  const { error } = await supabase
                    .from('clients')
                    .delete()
                    .eq('id', selectedClient.id);

                  if (error) throw error;

                  await fetchClients();
                  setIsDeleteModalOpen(false);
                  setSelectedClient(null);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro ao excluir cliente');
                }
              }}
            >
              Excluir
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-secondary-700">
            Tem certeza que deseja excluir o cliente <strong>{selectedClient?.company}</strong>?
          </p>
          <p className="text-sm text-error-600">
            Esta ação não pode ser desfeita!
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;