import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Download, Filter, Info } from 'lucide-react';

const Commissions: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const clients = [
    {
      id: 1,
      name: 'Empresa A',
      monthlyValue: 5000,
      startDate: '2025-04-01',
      status: 'active',
      consultantId: '1',
      consultantName: 'Consultor Demo',
      directorId: '3',
      directorName: 'Diretor Demo',
      isFirstMonth: true
    },
    {
      id: 2,
      name: 'Empresa B',
      monthlyValue: 3000,
      startDate: '2025-03-01',
      status: 'active',
      consultantId: '1',
      consultantName: 'Consultor Demo',
      directorId: '3',
      directorName: 'Diretor Demo',
      isFirstMonth: false
    },
    {
      id: 3,
      name: 'Empresa C',
      monthlyValue: 7500,
      startDate: '2025-04-10',
      status: 'inactive', // This client won't generate commissions
      consultantId: '1',
      consultantName: 'Consultor Demo',
      directorId: '3',
      directorName: 'Diretor Demo',
      isFirstMonth: true
    },
  ];

  const calculateCommissions = (client: typeof clients[0]) => {
    // Only calculate commissions for active clients
    if (client.status !== 'active') {
      return {
        consultantCommission: 0,
        directorCommission: 0,
        recurrenceValue: 0
      };
    }

    const baseValue = client.monthlyValue;
    const recurrenceValue = baseValue * 0.05; // 5% fixed recurrence
    
    if (client.isFirstMonth) {
      // First month: Consultant 20%, Director 10%
      return {
        consultantCommission: baseValue * 0.20,
        directorCommission: baseValue * 0.10,
        recurrenceValue
      };
    } else {
      // Following months: Only 5% recurrence
      return {
        consultantCommission: recurrenceValue,
        directorCommission: recurrenceValue,
        recurrenceValue
      };
    }
  };

  const commissions = useMemo(() => {
    // Filter clients based on user role
    const relevantClients = clients.filter(client => {
      if (user?.role === 'consultant') {
        return client.consultantId === user.id;
      }
      if (user?.role === 'director') {
        return client.directorId === user.id;
      }
      return true; // For admin, show all
    });

    return relevantClients.map(client => {
      const commission = calculateCommissions(client);
      return {
        id: client.id,
        client: client.name,
        value: client.monthlyValue,
        consultantName: client.consultantName,
        directorName: client.directorName,
        consultantCommission: commission.consultantCommission,
        directorCommission: commission.directorCommission,
        recurrenceValue: commission.recurrenceValue,
        date: client.startDate,
        status: client.status,
        isFirstMonth: client.isFirstMonth
      };
    });
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm" rounded>Ativo</Badge>;
      case 'inactive':
        return <Badge variant="error" size="sm" rounded>Inativo</Badge>;
      default:
        return <Badge variant="secondary" size="sm" rounded>{status}</Badge>;
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

  // Calculate totals only from active clients
  const activeCommissions = commissions.filter(commission => commission.status === 'active');
  
  const totalPending = activeCommissions.reduce((sum, commission) => 
    sum + (user?.role === 'director' ? commission.directorCommission : commission.consultantCommission)
  , 0);

  const totalPaid = 1500; // Mock value
  const nextMonthRecurrence = activeCommissions.reduce((sum, commission) => 
    sum + commission.recurrenceValue
  , 0);

  return (
    <div className="pb-6">
      <PageHeader 
        title="Comissões"
        subtitle={
          <div className="flex items-center gap-2">
            <span>Acompanhe suas comissões e histórico de pagamentos</span>
            <div className="group relative">
              <Info size={16} className="text-secondary-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-white rounded-lg shadow-lg border border-secondary-200 text-xs text-secondary-600">
                Primeiro mês: Consultor 20%, Diretor 10%
                <br />
                Recorrência: 5% do valor do contrato
                <br />
                Obs: Apenas clientes ativos geram comissões
              </div>
            </div>
          </div>
        }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total Pendente</p>
              <p className="text-2xl font-bold text-warning-600 mt-1">
                {formatCurrency(totalPending)}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total Pago (Mês)</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {formatCurrency(totalPaid)}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Recorrência Próximo Mês</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {formatCurrency(nextMonthRecurrence)}
              </p>
              <p className="text-xs text-secondary-500 mt-1">(5% dos contratos ativos)</p>
            </div>
          </Card>
        </div>

        <Card>
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Valor Contrato</Th>
                {user?.role === 'admin' && (
                  <>
                    <Th>Consultor</Th>
                    <Th>Diretor</Th>
                  </>
                )}
                <Th>Comissão</Th>
                <Th>Recorrência</Th>
                <Th>Data</Th>
                <Th>Status</Th>
              </Tr>
            </THead>
            <TBody>
              {commissions.map((commission) => {
                const commissionValue = user?.role === 'director' 
                  ? commission.directorCommission 
                  : commission.consultantCommission;
                const commissionPercentage = commission.isFirstMonth
                  ? (user?.role === 'director' ? '10%' : '20%')
                  : '5%';
                
                return (
                  <Tr key={commission.id}>
                    <Td>{commission.client}</Td>
                    <Td>{formatCurrency(commission.value)}</Td>
                    {user?.role === 'admin' && (
                      <>
                        <Td>{commission.consultantName}</Td>
                        <Td>{commission.directorName}</Td>
                      </>
                    )}
                    <Td>
                      <div>
                        <span className="font-medium">{formatCurrency(commissionValue)}</span>
                        <span className="text-xs text-secondary-500 ml-1">
                          ({commission.status === 'active' ? commissionPercentage : '-'})
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <div>
                        <span className="font-medium">{formatCurrency(commission.recurrenceValue)}</span>
                        <span className="text-xs text-secondary-500 ml-1">
                          ({commission.status === 'active' ? '5%' : '-'})
                        </span>
                      </div>
                    </Td>
                    <Td>{formatDate(commission.date)}</Td>
                    <Td>{getStatusBadge(commission.status)}</Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Commissions;