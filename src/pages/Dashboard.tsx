import React from 'react';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import { Calendar, Phone, Users, Briefcase, BarChart4, ChevronRight, TrendingUp, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const stats = [
    { id: 1, name: 'Ligações Realizadas', value: '42', icon: <Phone size={20} />, change: '+12%', color: 'bg-blue-500' },
    { id: 2, name: 'Reuniões Agendadas', value: '8', icon: <Calendar size={20} />, change: '+25%', color: 'bg-green-500' },
    { id: 3, name: 'Clientes Fechados', value: '2', icon: <Briefcase size={20} />, change: '+50%', color: 'bg-purple-500' },
    { id: 4, name: 'Comissão Mensal', value: 'R$ 1.240,00', icon: <BarChart4 size={20} />, change: '+18%', color: 'bg-primary-500' },
  ];

  // Mock traffic data
  const trafficStats = [
    { id: 1, name: 'Investimento em Tráfego', value: 'R$ 2.500,00', icon: <DollarSign size={20} />, change: '+15%', color: 'bg-indigo-500' },
    { id: 2, name: 'Novos Clientes', value: '520', icon: <Users size={20} />, change: '+30%', color: 'bg-pink-500' },
    { id: 3, name: 'ROI Tráfego', value: '350%', icon: <TrendingUp size={20} />, change: '+25%', color: 'bg-orange-500' },
  ];
  
  const nextMeetings = [
    { id: 1, company: 'Empresa A', contactName: 'João Silva', date: '2025-04-20 14:00', status: 'confirmed' },
    { id: 2, company: 'Empresa B', contactName: 'Maria Oliveira', date: '2025-04-21 10:30', status: 'pending' },
    { id: 3, company: 'Empresa C', contactName: 'Carlos Santos', date: '2025-04-22 16:00', status: 'confirmed' },
  ];
  
  const recentLeads = [
    { id: 1, company: 'Empresa D', contactName: 'Ana Luiza', status: 'no_answer', createdAt: '2025-04-18' },
    { id: 2, company: 'Empresa E', contactName: 'Roberto Ferreira', status: 'callback', createdAt: '2025-04-19' },
    { id: 3, company: 'Empresa F', contactName: 'Patrícia Mendes', status: 'has_provider', createdAt: '2025-04-19' },
  ];

  // Mock traffic data for table
  const trafficData = [
    { month: 'Janeiro', year: 2025, investment: 2000, newCustomers: 400 },
    { month: 'Fevereiro', year: 2025, investment: 2500, newCustomers: 520 },
    { month: 'Março', year: 2025, investment: 3000, newCustomers: 650 }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" size="sm" rounded>Confirmada</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm" rounded>Pendente</Badge>;
      case 'no_answer':
        return <Badge variant="secondary" size="sm" rounded>Sem Resposta</Badge>;
      case 'callback':
        return <Badge variant="primary" size="sm" rounded>Retornar</Badge>;
      case 'has_provider':
        return <Badge variant="error" size="sm" rounded>Tem Fornecedor</Badge>;
      default:
        return <Badge variant="secondary" size="sm" rounded>{status}</Badge>;
    }
  };
  
  const formatDate = (dateStr: string) => {
    const [date, time] = dateStr.split(' ');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}${time ? ' ' + time : ''}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Director-specific data
  const consultants = [
    { id: 1, name: 'Consultor 1', totalCalls: 48, totalMeetings: 6, totalClosures: 1 },
    { id: 2, name: 'Consultor 2', totalCalls: 52, totalMeetings: 8, totalClosures: 2 },
    { id: 3, name: 'Consultor 3', totalCalls: 38, totalMeetings: 4, totalClosures: 0 },
  ];
  
  // Client-specific data
  const customerStats = [
    { id: 1, name: 'Clientes Captados', value: '12', icon: <Users size={20} />, change: '+20%', color: 'bg-blue-500' },
    { id: 2, name: 'Faturamento Total', value: 'R$ 5.800,00', icon: <BarChart4 size={20} />, change: '+15%', color: 'bg-green-500' },
    { id: 3, name: 'Taxa de Conversão', value: '22%', icon: <TrendingUp size={20} />, change: '+8%', color: 'bg-purple-500' },
    ...trafficStats
  ];
  
  const renderConsultantDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="border-t-4" style={{ borderTopColor: stat.color }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-secondary-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color} bg-opacity-20 text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-success-600 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                {stat.change}
              </span>
              <span className="text-secondary-400 ml-1">vs. semana anterior</span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 px-4">
        <Card title="Próximas Reuniões" hoverable>
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Empresa</Th>
                <Th>Contato</Th>
                <Th>Data</Th>
                <Th>Status</Th>
              </Tr>
            </THead>
            <TBody>
              {nextMeetings.map((meeting) => (
                <Tr key={meeting.id}>
                  <Td>{meeting.company}</Td>
                  <Td>{meeting.contactName}</Td>
                  <Td>{formatDate(meeting.date)}</Td>
                  <Td>{getStatusBadge(meeting.status)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth
              rightIcon={<ChevronRight size={16} />}
            >
              Ver Todas as Reuniões
            </Button>
          </div>
        </Card>
        
        <Card title="Leads Recentes" hoverable>
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Empresa</Th>
                <Th>Contato</Th>
                <Th>Status</Th>
                <Th>Data</Th>
              </Tr>
            </THead>
            <TBody>
              {recentLeads.map((lead) => (
                <Tr key={lead.id}>
                  <Td>{lead.company}</Td>
                  <Td>{lead.contactName}</Td>
                  <Td>{getStatusBadge(lead.status)}</Td>
                  <Td>{formatDate(lead.createdAt)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth
              rightIcon={<ChevronRight size={16} />}
            >
              Ver Todos os Leads
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
  
  const renderDirectorDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="border-t-4" style={{ borderTopColor: stat.color }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-secondary-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color} bg-opacity-20 text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-success-600 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                {stat.change}
              </span>
              <span className="text-secondary-400 ml-1">vs. semana anterior</span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-4 mt-6 px-4">
        <Card title="Desempenho dos Consultores" hoverable>
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Consultor</Th>
                <Th>Ligações</Th>
                <Th>Reuniões</Th>
                <Th>Fechamentos</Th>
                <Th>Taxa Conversão</Th>
              </Tr>
            </THead>
            <TBody>
              {consultants.map((consultant) => (
                <Tr key={consultant.id}>
                  <Td>{consultant.name}</Td>
                  <Td>{consultant.totalCalls}</Td>
                  <Td>{consultant.totalMeetings}</Td>
                  <Td>{consultant.totalClosures}</Td>
                  <Td>
                    {Math.round((consultant.totalClosures / consultant.totalMeetings) * 100) || 0}%
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth
              rightIcon={<ChevronRight size={16} />}
            >
              Ver Relatório Completo
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
  
  const renderClientDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {customerStats.map((stat) => (
          <Card key={stat.id} className="border-t-4" style={{ borderTopColor: stat.color }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-secondary-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color} bg-opacity-20 text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-success-600 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                {stat.change}
              </span>
              <span className="text-secondary-400 ml-1">vs. mês anterior</span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-4 mt-6 px-4">
        <Card title="Análise de Tráfego Pago" hoverable>
          <Table hoverable>
            <THead>
              <Tr>
                <Th>Mês/Ano</Th>
                <Th>Investimento</Th>
                <Th>Novos Clientes</Th>
                <Th>Custo/Cliente</Th>
                <Th>ROI</Th>
              </Tr>
            </THead>
            <TBody>
              {trafficData.map((data, index) => {
                const costPerCustomer = data.investment / data.newCustomers;
                const roi = ((data.newCustomers * 100) / data.investment) - 1;
                
                return (
                  <Tr key={index}>
                    <Td>{`${data.month}/${data.year}`}</Td>
                    <Td>{formatCurrency(data.investment)}</Td>
                    <Td>{data.newCustomers}</Td>
                    <Td>{formatCurrency(costPerCustomer)}</Td>
                    <Td className="text-success-600">{`${roi.toFixed(1)}%`}</Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth
              rightIcon={<ChevronRight size={16} />}
            >
              Ver Relatório Completo
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
  
  let dashboardContent;
  
  switch (user?.role) {
    case 'consultant':
      dashboardContent = renderConsultantDashboard();
      break;
    case 'director':
      dashboardContent = renderDirectorDashboard();
      break;
    case 'client':
      dashboardContent = renderClientDashboard();
      break;
    default:
      dashboardContent = renderConsultantDashboard();
  }
  
  return (
    <div className="pb-6">
      <PageHeader 
        title={`Bem-vindo, ${user?.name}`} 
        subtitle="Aqui está um resumo das suas atividades recentes"
      />
      
      {dashboardContent}
    </div>
  );
};

export default Dashboard;