import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { DollarSign, Bell, Download, Filter, MessageSquare } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { format, isAfter, isBefore, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useNotifications from '../hooks/useNotifications';
import NotificationPopup from '../components/ui/NotificationPopup';

const Financial: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { addNotification } = useNotifications();
  const [activeNotification, setActiveNotification] = useState<any>(null);

  // Mock data para demonstração
  const clients = [
    {
      id: 1,
      name: 'João Silva',
      company: 'Empresa A',
      whatsapp: '11987654321',
      paymentDate: '2025-04-25',
      monthlyValue: 5000,
      status: 'pending'
    },
    {
      id: 2,
      name: 'Maria Santos',
      company: 'Empresa B',
      whatsapp: '11987654322',
      paymentDate: '2025-04-20',
      monthlyValue: 3500,
      status: 'overdue'
    }
  ];

  const commissions = [
    {
      id: 1,
      name: 'Pedro Consultor',
      role: 'consultant',
      totalValue: 2500,
      clients: 5,
      paymentDate: '2025-05-10'
    },
    {
      id: 2,
      name: 'Ana Diretora',
      role: 'director',
      totalValue: 4500,
      clients: 12,
      paymentDate: '2025-05-10'
    }
  ];

  useEffect(() => {
    // Verifica pagamentos próximos do vencimento
    clients.forEach(client => {
      const dueDate = new Date(client.paymentDate);
      const today = new Date();
      
      if (isAfter(dueDate, today) && isBefore(dueDate, subDays(dueDate, 1))) {
        const notification = {
          id: `payment-${client.id}`,
          title: 'Pagamento Próximo do Vencimento',
          message: `O pagamento de ${client.company} vence amanhã`,
          type: 'payment' as const
        };
        
        addNotification(notification);
        setActiveNotification(notification);
      }
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" size="sm">Pago</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="error" size="sm">Atrasado</Badge>;
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
    return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleWhatsAppClick = (client: any) => {
    const message = encodeURIComponent(
      `Olá ${client.name}, gostaríamos de lembrar que o pagamento no valor de ${formatCurrency(client.monthlyValue)} vence em ${formatDate(client.paymentDate)}.`
    );
    window.open(`https://wa.me/55${client.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Financeiro"
        subtitle="Gerencie pagamentos, comissões e notificações"
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
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total a Receber</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {formatCurrency(157500)}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Pagamentos Pendentes</p>
              <p className="text-2xl font-bold text-warning-600 mt-1">12</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Pagamentos Atrasados</p>
              <p className="text-2xl font-bold text-error-600 mt-1">3</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Comissões a Pagar</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {formatCurrency(45000)}
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Pagamentos de Clientes */}
          <Card title="Pagamentos de Clientes">
            <Table hoverable>
              <THead>
                <Tr>
                  <Th>Cliente</Th>
                  <Th>Empresa</Th>
                  <Th>Vencimento</Th>
                  <Th>Valor</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </THead>
              <TBody>
                {clients.map((client) => (
                  <Tr key={client.id}>
                    <Td>{client.name}</Td>
                    <Td>{client.company}</Td>
                    <Td>{formatDate(client.paymentDate)}</Td>
                    <Td>{formatCurrency(client.monthlyValue)}</Td>
                    <Td>{getStatusBadge(client.status)}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsAppClick(client)}
                        >
                          <MessageSquare size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedClient(client);
                            setIsModalOpen(true);
                          }}
                        >
                          <DollarSign size={16} />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </Card>

          {/* Comissões */}
          <Card title="Comissões a Pagar">
            <Table hoverable>
              <THead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Função</Th>
                  <Th>Total Clientes</Th>
                  <Th>Valor Total</Th>
                  <Th>Data Pagamento</Th>
                  <Th>Ações</Th>
                </Tr>
              </THead>
              <TBody>
                {commissions.map((commission) => (
                  <Tr key={commission.id}>
                    <Td>{commission.name}</Td>
                    <Td>
                      <Badge variant="primary" size="sm">
                        {commission.role === 'consultant' ? 'Consultor' : 'Diretor'}
                      </Badge>
                    </Td>
                    <Td>{commission.clients}</Td>
                    <Td>{formatCurrency(commission.totalValue)}</Td>
                    <Td>{formatDate(commission.paymentDate)}</Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppClick(commission)}
                      >
                        <MessageSquare size={16} />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Pagamento"
        size="md"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button>
              Confirmar Pagamento
            </Button>
          </div>
        }
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Valor do Pagamento</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(selectedClient.monthlyValue)}
              </p>
            </div>

            <Input
              label="Data do Pagamento"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Observações
              </label>
              <textarea
                className="w-full h-32 p-3 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Digite observações sobre o pagamento..."
              />
            </div>
          </div>
        )}
      </Modal>

      {activeNotification && (
        <NotificationPopup
          notification={activeNotification}
          onClose={() => setActiveNotification(null)}
        />
      )}
    </div>
  );
};

export default Financial;