import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Plus, FileText, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Scripts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);

  // Mock data for demonstration
  const scripts = [
    {
      id: 1,
      title: 'Script de Vendas - Primeiro Contato',
      type: 'sales',
      content: `1. Apresentação
- Bom dia/tarde, meu nome é [Nome] da Camba Marketing Digital
- Estou falando com [Nome do Contato]?

2. Qualificação
- Você é responsável pelo marketing da empresa?
- Como está o marketing digital da sua empresa atualmente?

3. Apresentação da Solução
- Baseado no que você me contou...
- Nossa solução pode ajudar...

4. Agendamento
- Que tal marcarmos uma reunião para...
- Tenho disponibilidade para...`,
      lastModified: '2025-04-15'
    },
    {
      id: 2,
      title: 'Script de Follow-up - Pós Reunião',
      type: 'follow_up',
      content: `1. Contextualização
- Olá [Nome], tudo bem?
- Estou ligando conforme combinamos na nossa última reunião...

2. Verificação
- O que achou da nossa proposta?
- Teve chance de avaliar com a diretoria?

3. Próximos Passos
- Podemos agendar uma nova reunião?
- Vou enviar uma proposta atualizada...`,
      lastModified: '2025-04-16'
    }
  ];

  const handleNewScript = () => {
    setSelectedScript(null);
    setIsModalOpen(true);
  };

  const handleEditScript = (script: any) => {
    setSelectedScript(script);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Scripts"
        subtitle="Gerencie seus scripts de atendimento e follow-up"
        actions={
          <Button
            leftIcon={<Plus size={16} />}
            onClick={handleNewScript}
          >
            Novo Script
          </Button>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((script) => (
            <Card 
              key={script.id}
              hoverable
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <FileText size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900">{script.title}</h3>
                    <p className="text-sm text-secondary-500 mt-1">
                      Última modificação: {formatDate(script.lastModified)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditScript(script)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 size={16} className="text-error-500" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <pre className="whitespace-pre-wrap text-sm text-secondary-600 bg-secondary-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                  {script.content}
                </pre>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedScript ? "Editar Script" : "Novo Script"}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button>
              {selectedScript ? "Salvar Alterações" : "Criar Script"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            placeholder="Digite o título do script"
            defaultValue={selectedScript?.title}
          />
          <Select
            label="Tipo"
            options={[
              { value: 'sales', label: 'Vendas' },
              { value: 'follow_up', label: 'Follow-up' }
            ]}
            defaultValue={selectedScript?.type}
          />
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Conteúdo
            </label>
            <textarea
              className="w-full h-64 p-3 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite o conteúdo do script..."
              defaultValue={selectedScript?.content}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Scripts;