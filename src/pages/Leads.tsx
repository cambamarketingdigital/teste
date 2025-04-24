import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { UserPlus, Download, Filter, Search, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { LeadStatus } from '../types';
import { useAuth } from '../hooks/useAuth';

const Leads: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Mock data for demonstration
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'João Silva',
      company: 'Empresa X',
      phone: '(11) 99999-9999',
      email: 'joao@empresax.com',
      status: 'no_answer' as LeadStatus,
      createdAt: '2025-04-15',
      followUpDate: '2025-04-20'
    },
    {
      id: 2,
      name: 'Maria Santos',
      company: 'Empresa Y',
      phone: '(11) 88888-8888',
      email: 'maria@empresay.com',
      status: 'callback' as LeadStatus,
      createdAt: '2025-04-16',
      followUpDate: '2025-04-21'
    }
  ]);

  const handleDeleteLead = () => {
    if (!selectedLead) return;
    
    setLeads(leads.filter(lead => lead.id !== selectedLead.id));
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'no_answer':
        return <Badge variant="warning" size="sm">Sem Resposta</Badge>;
      case 'auto_reply':
        return <Badge variant="secondary" size="sm">Resposta Automática</Badge>;
      case 'has_provider':
        return <Badge variant="error" size="sm">Tem Fornecedor</Badge>;
      case 'talk_to_boss':
        return <Badge variant="primary" size="sm">Falar com Responsável</Badge>;
      case 'callback':
        return <Badge variant="warning" size="sm">Retornar</Badge>;
      case 'meeting_scheduled':
        return <Badge variant="success" size="sm">Reunião Agendada</Badge>;
      case 'closed':
        return <Badge variant="success" size="sm">Fechado</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Leads"
        subtitle="Gerencie seus leads e acompanhe o progresso das negociações"
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
              onClick={() => setIsModalOpen(true)}
            >
              Novo Lead
            </Button>
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total de Leads</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">45</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Leads Ativos</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">28</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Reuniões Agendadas</p>
              <p className="text-2xl font-bold text-success-600 mt-1">12</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">26.7%</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Buscar lead..."
              leftIcon={<Search size={16} className="text-secondary-400" />}
            />
          </div>

          <Table hoverable>
            <THead>
              <Tr>
                <Th>Nome</Th>
                <Th>Empresa</Th>
                <Th>Telefone</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Data Cadastro</Th>
                <Th>Follow-up</Th>
                {user?.role === 'admin' && <Th>Ações</Th>}
              </Tr>
            </THead>
            <TBody>
              {leads.map((lead) => (
                <Tr key={lead.id}>
                  <Td>{lead.name}</Td>
                  <Td>{lead.company}</Td>
                  <Td>{lead.phone}</Td>
                  <Td>{lead.email}</Td>
                  <Td>{getStatusBadge(lead.status)}</Td>
                  <Td>{formatDate(lead.createdAt)}</Td>
                  <Td>{formatDate(lead.followUpDate)}</Td>
                  {user?.role === 'admin' && (
                    <Td>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-error-500 hover:bg-error-50"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Td>
                  )}
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
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
              onClick={handleDeleteLead}
            >
              Excluir
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-secondary-700">
            Tem certeza que deseja excluir o lead <strong>{selectedLead?.name}</strong>?
          </p>
          <p className="text-sm text-error-600">
            Esta ação não pode ser desfeita!
          </p>
        </div>
      </Modal>

      {/* Other existing modals... */}
    </div>
  );
};

export default Leads;