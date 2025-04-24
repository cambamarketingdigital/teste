import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import { Download, Filter, TrendingUp, Plus, Edit2 } from 'lucide-react';
import Modal from '../components/ui/Modal';

interface TrafficData {
  month: string;
  year: number;
  investment: number;
  revenue: number;
  newCustomers: number;
  averageTicket: number;
}

const MyCustomers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [revenue, setRevenue] = useState('');
  const [newCustomers, setNewCustomers] = useState('');
  const [averageTicket, setAverageTicket] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingTraffic, setEditingTraffic] = useState<TrafficData | null>(null);

  // Mock traffic data
  const [trafficData, setTrafficData] = useState<TrafficData[]>([
    {
      month: 'Janeiro',
      year: 2025,
      investment: 2000,
      revenue: 8000,
      newCustomers: 40,
      averageTicket: 200
    },
    {
      month: 'Fevereiro',
      year: 2025,
      investment: 2500,
      revenue: 12500,
      newCustomers: 50,
      averageTicket: 250
    },
    {
      month: 'Março',
      year: 2025,
      investment: 3000,
      revenue: 18000,
      newCustomers: 60,
      averageTicket: 300
    }
  ]);

  const handleSubmit = () => {
    if (!selectedMonth || !investmentAmount || !revenue || !newCustomers || !averageTicket) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const newData: TrafficData = {
      month: selectedMonth,
      year: parseInt(selectedYear),
      investment: parseFloat(investmentAmount),
      revenue: parseFloat(revenue),
      newCustomers: parseInt(newCustomers),
      averageTicket: parseFloat(averageTicket)
    };

    if (editingTraffic) {
      setTrafficData(prev => prev.map(item => 
        item.month === editingTraffic.month && item.year === editingTraffic.year ? newData : item
      ));
    } else {
      setTrafficData(prev => [...prev, newData]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (data: TrafficData) => {
    setEditingTraffic(data);
    setSelectedMonth(data.month);
    setSelectedYear(data.year.toString());
    setInvestmentAmount(data.investment.toString());
    setRevenue(data.revenue.toString());
    setNewCustomers(data.newCustomers.toString());
    setAverageTicket(data.averageTicket.toString());
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedMonth('');
    setSelectedYear(new Date().getFullYear().toString());
    setInvestmentAmount('');
    setRevenue('');
    setNewCustomers('');
    setAverageTicket('');
    setError(null);
    setEditingTraffic(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

  // Calculate metrics
  const totalInvestment = trafficData.reduce((sum, data) => sum + data.investment, 0);
  const totalRevenue = trafficData.reduce((sum, data) => sum + data.revenue, 0);
  const totalCustomers = trafficData.reduce((sum, data) => sum + data.newCustomers, 0);
  const averageROI = ((totalRevenue - totalInvestment) / totalInvestment) * 100;
  const averageCostPerCustomer = totalInvestment / totalCustomers;

  return (
    <div className="pb-6">
      <PageHeader 
        title="Tráfego Pago"
        subtitle="Acompanhe seus resultados e retorno sobre investimento em tráfego pago"
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
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              Novo Mês
            </Button>
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <p className="text-sm text-secondary-500">Faturamento Total</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">ROI Médio</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {averageROI.toFixed(1)}%
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Custo por Cliente</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {formatCurrency(averageCostPerCustomer)}
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              Histórico Mensal
            </h3>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              Novo Mês
            </Button>
          </div>

          <Table hoverable>
            <THead>
              <Tr>
                <Th>Mês/Ano</Th>
                <Th>Investimento</Th>
                <Th>Faturamento</Th>
                <Th>Novos Clientes</Th>
                <Th>Ticket Médio</Th>
                <Th>ROI</Th>
                <Th>Ações</Th>
              </Tr>
            </THead>
            <TBody>
              {trafficData.map((data, index) => {
                const roi = ((data.revenue - data.investment) / data.investment) * 100;
                
                return (
                  <Tr key={index}>
                    <Td>{`${data.month}/${data.year}`}</Td>
                    <Td>{formatCurrency(data.investment)}</Td>
                    <Td>{formatCurrency(data.revenue)}</Td>
                    <Td>{data.newCustomers}</Td>
                    <Td>{formatCurrency(data.averageTicket)}</Td>
                    <Td className="text-success-600">{`${roi.toFixed(1)}%`}</Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(data)}
                      >
                        <Edit2 size={16} />
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* Add/Edit Month Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTraffic ? "Editar Mês" : "Novo Mês"}
        size="md"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingTraffic ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Mês"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              options={months.map(month => ({ value: month, label: month }))}
              required
            />

            <Select
              label="Ano"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              options={years.map(year => ({ value: year, label: year }))}
              required
            />
          </div>

          <Input
            label="Valor Investido"
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="0,00"
            required
          />

          <Input
            label="Faturamento"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="0,00"
            required
          />

          <Input
            label="Novos Clientes"
            type="number"
            value={newCustomers}
            onChange={(e) => setNewCustomers(e.target.value)}
            placeholder="0"
            required
          />

          <Input
            label="Ticket Médio"
            type="number"
            value={averageTicket}
            onChange={(e) => setAverageTicket(e.target.value)}
            placeholder="0,00"
            required
          />

          {error && (
            <div className="p-3 rounded-md bg-error-50 text-error-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyCustomers;