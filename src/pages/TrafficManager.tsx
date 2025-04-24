import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { 
  Plus, Filter, Download, Calendar, Clock, AlertCircle,
  Facebook, Instagram, Mail, Key, Edit2, TrendingUp
} from 'lucide-react';

interface ClientCampaign {
  id: string;
  clientName: string;
  platforms: string[];
  setupDeadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  investment: number;
  conversions: number;
  revenue: number;
}

const TrafficManager: React.FC = () => {
  const [isNewClientModal, setIsNewClientModal] = useState(false);
  const [isMetricsModal, setIsMetricsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientCampaign | null>(null);

  // Mock data
  const campaigns: ClientCampaign[] = [
    {
      id: '1',
      clientName: 'Empresa A',
      platforms: ['facebook', 'instagram', 'google'],
      setupDeadline: '2025-05-01',
      status: 'in_progress',
      investment: 2000,
      conversions: 45,
      revenue: 9000
    },
    {
      id: '2',
      clientName: 'Empresa B',
      platforms: ['facebook', 'google'],
      setupDeadline: '2025-05-15',
      status: 'pending',
      investment: 1500,
      conversions: 30,
      revenue: 6000
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Concluído</Badge>;
      case 'in_progress':
        return <Badge variant="primary" size="sm">Em Andamento</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pendente</Badge>;
      case 'delayed':
        return <Badge variant="error" size="sm">Atrasado</Badge>;
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={16} className="text-blue-600" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-600" />;
      case 'google':
        return <Mail size={16} className="text-red-600" />;
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

  // Calculate metrics
  const totalInvestment = campaigns.reduce((sum, campaign) => sum + campaign.investment, 0);
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const averageROI = ((totalRevenue - totalInvestment) / totalInvestment) * 100;

  return (
    <div className="pb-6">
      <PageHeader 
        title="Gestão de Tráfego"
        subtitle="Gerencie campanhas e acompanhe resultados dos clientes"
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
              leftIcon={<Plus size={16} />}
              onClick={() => setIsNewClientModal(true)}
            >
              Novo Cliente
            </Button>
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Clientes Ativos</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {campaigns.length}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Investimento Total</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {formatCurrency(totalInvestment)}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">ROI Médio</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {averageROI.toFixed(1)}%
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total Conversões</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {totalConversions}
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              Campanhas Ativas
            </h3>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsNewClientModal(true)}
            >
              Nova Campanha
            </Button>
          </div>

          <Table hoverable>
            <THead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Plataformas</Th>
                <Th>Prazo Config.</Th>
                <Th>Status</Th>
                <Th>Investimento</Th>
                <Th>Conversões</Th>
                <Th>ROI</Th>
                <Th>Ações</Th>
              </Tr>
            </THead>
            <TBody>
              {campaigns.map((campaign) => {
                const roi = ((campaign.revenue - campaign.investment) / campaign.investment) * 100;
                
                return (
                  <Tr key={campaign.id}>
                    <Td>{campaign.clientName}</Td>
                    <Td>
                      <div className="flex gap-2">
                        {campaign.platforms.map((platform) => (
                          <div key={platform} className="tooltip" data-tip={platform}>
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </Td>
                    <Td>{formatDate(campaign.setupDeadline)}</Td>
                    <Td>{getStatusBadge(campaign.status)}</Td>
                    <Td>{formatCurrency(campaign.investment)}</Td>
                    <Td>{campaign.conversions}</Td>
                    <Td className="text-success-600">{`${roi.toFixed(1)}%`}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedClient(campaign);
                            setIsMetricsModal(true);
                          }}
                        >
                          <TrendingUp size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedClient(campaign);
                            setIsNewClientModal(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* New Client/Campaign Modal */}
      <Modal
        isOpen={isNewClientModal}
        onClose={() => {
          setIsNewClientModal(false);
          setSelectedClient(null);
        }}
        title={selectedClient ? "Editar Campanha" : "Nova Campanha"}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsNewClientModal(false);
                setSelectedClient(null);
              }}
            >
              Cancelar
            </Button>
            <Button>
              {selectedClient ? "Salvar Alterações" : "Criar Campanha"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome do Cliente"
              defaultValue={selectedClient?.clientName}
              required
            />
            <Input
              label="Prazo de Configuração"
              type="date"
              defaultValue={selectedClient?.setupDeadline}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Plataformas
            </label>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'google'].map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={selectedClient?.platforms.includes(platform)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700 capitalize">
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Credentials Section */}
          <div className="space-y-4 border-t border-secondary-200 pt-4 mt-4">
            <h4 className="font-medium text-secondary-900">Credenciais</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-secondary-50 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Facebook size={20} className="text-blue-600" />
                  <h5 className="font-medium">Facebook</h5>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    leftIcon={<Mail size={16} />}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    leftIcon={<Key size={16} />}
                  />
                </div>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Instagram size={20} className="text-pink-600" />
                  <h5 className="font-medium">Instagram</h5>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    leftIcon={<Mail size={16} />}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    leftIcon={<Key size={16} />}
                  />
                </div>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Mail size={20} className="text-red-600" />
                  <h5 className="font-medium">Google Ads</h5>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    leftIcon={<Mail size={16} />}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    leftIcon={<Key size={16} />}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Observações
            </label>
            <textarea
              className="w-full h-32 p-3 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite observações sobre a campanha..."
            />
          </div>
        </div>
      </Modal>

      {/* Metrics Modal */}
      <Modal
        isOpen={isMetricsModal}
        onClose={() => {
          setIsMetricsModal(false);
          setSelectedClient(null);
        }}
        title={`Métricas - ${selectedClient?.clientName}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-secondary-500">Investimento Total</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  {selectedClient && formatCurrency(selectedClient.investment)}
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <p className="text-sm text-secondary-500">ROI</p>
                <p className="text-2xl font-bold text-success-600 mt-1">
                  {selectedClient && 
                    `${(((selectedClient.revenue - selectedClient.investment) / selectedClient.investment) * 100).toFixed(1)}%`
                  }
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Métricas por Plataforma</h4>
            
            {selectedClient?.platforms.map((platform) => (
              <div key={platform} className="p-4 bg-secondary-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(platform)}
                    <h5 className="font-medium capitalize">{platform}</h5>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Edit2 size={16} />}>
                    Editar
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-secondary-500">Impressões</p>
                    <p className="text-lg font-semibold">12.500</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Cliques</p>
                    <p className="text-lg font-semibold">850</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">CTR</p>
                    <p className="text-lg font-semibold">6.8%</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">CPC Médio</p>
                    <p className="text-lg font-semibold">R$ 0,85</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setIsMetricsModal(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrafficManager;