import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Plus, Calendar, Clock, CheckCircle, History } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NotificationPopup from '../components/ui/NotificationPopup';
import useNotifications from '../hooks/useNotifications';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, completeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const { addNotification } = useNotifications();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedDays, setEstimatedDays] = useState(1);

  // Mock consultants data
  const consultants = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
  ];

  useEffect(() => {
    // Check for tasks near due date
    tasks.forEach(task => {
      if (task.status !== 'done') {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        
        if (isAfter(today, addDays(dueDate, -1))) {
          addNotification({
            title: 'Tarefa Próxima do Vencimento',
            message: `A tarefa "${task.title}" vence em breve`,
            type: 'emergency',
          });
        }
      }
    });
  }, [tasks]);

  const handleSubmit = () => {
    const newTask = {
      title,
      description,
      assignedTo,
      assignedBy: user?.id || '',
      dueDate: new Date(dueDate),
      priority,
      status: 'todo' as const,
      estimatedDays: Number(estimatedDays),
    };

    addTask(newTask);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
    setEstimatedDays(1);
  };

  const handleComplete = (taskId: string) => {
    completeTask(taskId, user?.id || '');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error" size="sm">Alta</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Média</Badge>;
      case 'low':
        return <Badge variant="secondary" size="sm">Baixa</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const sortTasks = (tasks: any[]) => {
    return tasks.sort((a, b) => {
      // Primeiro por prioridade
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Depois por data de vencimento
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const tasksByStatus = {
    todo: sortTasks(tasks.filter(t => t.status === 'todo')),
    doing: sortTasks(tasks.filter(t => t.status === 'doing')),
    done: tasks.filter(t => t.status === 'done').reverse(),
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Tarefas"
        subtitle="Gerencie suas tarefas e acompanhe o progresso"
        actions={
          user?.role === 'admin' || user?.role === 'director' ? (
            <Button
              leftIcon={<Plus size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Nova Tarefa
            </Button>
          ) : null
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do Column */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-secondary-700">A Fazer</h3>
            <div className="space-y-3">
              {tasksByStatus.todo.map((task) => (
                <Card key={task.id} hoverable className="cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-secondary-900">{task.title}</h4>
                      <p className="text-sm text-secondary-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getPriorityBadge(task.priority)}
                        <span className="text-sm text-secondary-500 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(task.dueDate)}
                        </span>
                        <span className="text-sm text-secondary-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {task.estimatedDays} dias
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(task.id)}
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsHistoryModalOpen(true);
                        }}
                      >
                        <History size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Doing Column */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-secondary-700">Em Andamento</h3>
            <div className="space-y-3">
              {tasksByStatus.doing.map((task) => (
                <Card key={task.id} hoverable className="cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-secondary-900">{task.title}</h4>
                      <p className="text-sm text-secondary-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getPriorityBadge(task.priority)}
                        <span className="text-sm text-secondary-500 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(task.dueDate)}
                        </span>
                        <span className="text-sm text-secondary-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {task.estimatedDays} dias
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(task.id)}
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsHistoryModalOpen(true);
                        }}
                      >
                        <History size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-secondary-700">Concluído</h3>
            <div className="space-y-3">
              {tasksByStatus.done.map((task) => (
                <Card key={task.id} hoverable className="cursor-pointer opacity-75">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-secondary-900">{task.title}</h4>
                      <p className="text-sm text-secondary-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getPriorityBadge(task.priority)}
                        <span className="text-sm text-secondary-500 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(task.dueDate)}
                        </span>
                        <span className="text-sm text-success-600 flex items-center">
                          <CheckCircle size={14} className="mr-1" />
                          Concluída
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsHistoryModalOpen(true);
                      }}
                    >
                      <History size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Nova Tarefa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Tarefa"
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Criar Tarefa
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Descrição
            </label>
            <textarea
              className="w-full h-32 p-3 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Select
            label="Atribuir para"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            options={consultants.map(c => ({ value: c.id, label: c.name }))}
            required
          />

          <Select
            label="Prioridade"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' }
            ]}
          />

          <Input
            label="Data de Vencimento"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <Input
            label="Dias Estimados"
            type="number"
            min="1"
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(Number(e.target.value))}
            required
          />
        </div>
      </Modal>

      {/* Modal de Histórico */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Histórico da Tarefa"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-medium text-secondary-900">{selectedTask.title}</h4>
              <p className="text-sm text-secondary-500 mt-1">{selectedTask.description}</p>
              <div className="flex items-center gap-2 mt-2">
                {getPriorityBadge(selectedTask.priority)}
                <span className="text-sm text-secondary-500">
                  Vence em {formatDate(selectedTask.dueDate)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Aqui você adicionaria o histórico real da tarefa */}
              <div className="p-3 border border-secondary-200 rounded-lg">
                <p className="text-sm text-secondary-900">Tarefa criada</p>
                <p className="text-xs text-secondary-500">
                  {format(selectedTask.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </div>
              {selectedTask.status === 'done' && (
                <div className="p-3 border border-secondary-200 rounded-lg">
                  <p className="text-sm text-secondary-900">Tarefa concluída</p>
                  <p className="text-xs text-secondary-500">
                    {format(selectedTask.completedAt || new Date(), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
              )}
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

export default Tasks;