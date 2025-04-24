import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { Download, Filter } from 'lucide-react';

const Reports: React.FC = () => {
  // Mock data for demonstration
  const performanceData = [
    {
      id: 1,
      consultant: 'Maria Santos',
      calls: 245,
      meetings: 15,
      closures: 3,
      conversionRate: '20%',
      revenue: 15500
    },
    {
      id: 2,
      consultant: 'João Silva',
      calls: 198,
      meetings: 12,
      closures: 2,
      conversionRate: '16.7%',
      revenue: 12000
    },
    {
      id: 3,
      consultant: 'Pedro Souza',
      calls: 156,
      meetings: 8,
      closures: 1,
      conversionRate: '12.5%',
      revenue: 7500
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Relatórios"
        subtitle="Visualize relatórios e métricas de desempenho"
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
              <p className="text-sm text-secondary-500">Total de Ligações</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">599</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Reuniões Realizadas</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">35</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Fechamentos</p>
              <p className="text-2xl font-bold text-success-600 mt-1">6</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Receita Total</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {formatCurrency(35000)}
              </p>
            </div>
          </Card>
        </div>

        <Card title="Desempenho da Equipe">
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Consultor</Th>
                <Th>Ligações</Th>
                <Th>Reuniões</Th>
                <Th>Fechamentos</Th>
                <Th>Taxa Conversão</Th>
                <Th>Receita</Th>
              </Tr>
            </THead>
            <TBody>
              {performanceData.map((data) => (
                <Tr key={data.id}>
                  <Td>{data.consultant}</Td>
                  <Td>{data.calls}</Td>
                  <Td>{data.meetings}</Td>
                  <Td>{data.closures}</Td>
                  <Td>{data.conversionRate}</Td>
                  <Td>{formatCurrency(data.revenue)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Reports;