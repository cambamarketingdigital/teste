import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { Calendar as CalendarIcon, Download, Filter, Search } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Meetings: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for demonstration
  const meetings = [
    {
      id: 1,
      company: 'Empresa X',
      contact: 'João Silva',
      date: '2025-04-20 14:00',
      type: 'presential',
      status: 'confirmed',
      notes: 'Apresentação inicial dos serviços'
    },
    {
      id: 2,
      company: 'Empresa Y',
      contact: 'Maria Santos',
      date: '2025-04-21 10:30',
      type: 'online',
      status: 'pending',
      notes: 'Follow-up da proposta'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" size="sm">Confirmada</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="sm">Cancelada</Badge>;
      case 'completed':
        return <Badge variant="secondary" size="sm">Realizada</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'presential':
        return <Badge variant="primary" size="sm">Presencial</Badge>;
      case 'online':
        return <Badge variant="secondary" size="sm">Online</Badge>;
      default:
        return null;
    }
  };

  const formatDateTime = (dateStr: string) => {
    const [date, time] = dateStr.split(' ');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time}`;
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Reuniões"
        subtitle="Acompanhe suas reuniões agendadas e histórico"
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
              leftIcon={<CalendarIcon size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Nova Reunião
            </Button>
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total de Reuniões</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">32</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Confirmadas</p>
              <p className="text-2xl font-bold text-success-600 mt-1">18</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Pendentes</p>
              <p className="text-2xl font-bold text-warning-600 mt-1">8</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Taxa de Comparecimento</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">85%</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Buscar reunião..."
              leftIcon={<Search size={16} className="text-secondary-400" />}
            />
          </div>

          <Table hoverable>
            <THead>
              <Tr>
                <Th>Empresa</Th>
                <Th>Contato</Th>
                <Th>Data/Hora</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Observações</Th>
              </Tr>
            </THead>
            <TBody>
              {meetings.map((meeting) => (
                <Tr key={meeting.id}>
                  <Td>{meeting.company}</Td>
                  <Td>{meeting.contact}</Td>
                  <Td>{formatDateTime(meeting.date)}</Td>
                  <Td>{getTypeBadge(meeting.type)}</Td>
                  <Td>{getStatusBadge(meeting.status)}</Td>
                  <Td>{meeting.notes}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Reunião"
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button>
              Agendar Reunião
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Empresa"
            placeholder="Digite o nome da empresa"
          />
          <Input
            label="Contato"
            placeholder="Digite o nome do contato"
          />
          <Input
            label="Data"
            type="date"
          />
          <Input
            label="Hora"
            type="time"
          />
          <Select
            label="Tipo"
            options={[
              { value: 'presential', label: 'Presencial' },
              { value: 'online', label: 'Online' }
            ]}
          />
          <Select
            label="Status"
            options={[
              { value: 'pending', label: 'Pendente' },
              { value: 'confirmed', label: 'Confirmada' }
            ]}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Observações
            </label>
            <textarea
              className="w-full h-32 p-3 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite as observações sobre a reunião..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Meetings;