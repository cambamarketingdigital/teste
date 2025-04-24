import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { UserPlus, Download, Filter } from 'lucide-react';

const Consultants: React.FC = () => {
  // Mock data for demonstration
  const consultants = [
    {
      id: 1,
      name: 'João Silva',
      director: 'Carlos Oliveira',
      totalCalls: 245,
      totalMeetings: 15,
      totalClosures: 3,
      status: 'active',
      performance: 'above_target'
    },
    {
      id: 2,
      name: 'Maria Santos',
      director: 'Carlos Oliveira',
      totalCalls: 198,
      totalMeetings: 12,
      totalClosures: 2,
      status: 'active',
      performance: 'on_target'
    },
    {
      id: 3,
      name: 'Pedro Souza',
      director: 'Carlos Oliveira',
      totalCalls: 156,
      totalMeetings: 8,
      totalClosures: 1,
      status: 'active',
      performance: 'below_target'
    }
  ];

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'above_target':
        return <Badge variant="success" size="sm">Acima da Meta</Badge>;
      case 'on_target':
        return <Badge variant="primary" size="sm">Na Meta</Badge>;
      case 'below_target':
        return <Badge variant="error" size="sm">Abaixo da Meta</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Consultores"
        subtitle="Gerencie sua equipe de consultores e acompanhe o desempenho"
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
            <Button
              leftIcon={<UserPlus size={16} />}
            >
              Novo Consultor
            </Button>
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total de Consultores</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">12</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Meta Atingida (Mês)</p>
              <p className="text-2xl font-bold text-success-600 mt-1">67%</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Fechamentos (Mês)</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">28</p>
            </div>
          </Card>
        </div>

        <Card>
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Consultor</Th>
                <Th>Diretor</Th>
                <Th>Ligações</Th>
                <Th>Reuniões</Th>
                <Th>Fechamentos</Th>
                <Th>Performance</Th>
              </Tr>
            </THead>
            <TBody>
              {consultants.map((consultant) => (
                <Tr key={consultant.id}>
                  <Td>{consultant.name}</Td>
                  <Td>{consultant.director}</Td>
                  <Td>{consultant.totalCalls}</Td>
                  <Td>{consultant.totalMeetings}</Td>
                  <Td>{consultant.totalClosures}</Td>
                  <Td>{getPerformanceBadge(consultant.performance)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Consultants;