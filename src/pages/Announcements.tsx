import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Plus, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useSound from 'use-sound';

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRoles: string[];
  importance: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdAt: Date;
}

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [viewedAnnouncements, setViewedAnnouncements] = useState<string[]>([]);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playNotification] = useSound('/sounds/emergency.mp3', {
    volume: 0.7,
    interrupt: true,
  });

  useEffect(() => {
    // Mock data for demonstration
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Novo Sistema de Comissões',
        content: 'Informamos que a partir do próximo mês teremos mudanças no sistema de comissões...',
        targetRoles: ['consultant', 'director'],
        importance: 'high',
        createdBy: 'admin',
        createdAt: new Date('2025-04-20T10:00:00Z')
      },
      {
        id: '2',
        title: 'Manutenção Programada',
        content: 'O sistema ficará indisponível para manutenção no próximo domingo...',
        targetRoles: ['consultant', 'director', 'client', 'financial', 'admin'],
        importance: 'urgent',
        createdBy: 'admin',
        createdAt: new Date('2025-04-19T15:30:00Z')
      }
    ];

    setAnnouncements(mockAnnouncements);
  }, []);

  useEffect(() => {
    const unviewedAnnouncements = announcements.filter(
      a => !viewedAnnouncements.includes(a.id)
    );

    if (unviewedAnnouncements.length > 0 && !isSoundMuted) {
      const interval = setInterval(() => {
        playNotification();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [announcements, viewedAnnouncements, isSoundMuted]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || targetRoles.length === 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      targetRoles,
      importance,
      createdBy: user?.id || '',
      createdAt: new Date()
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTargetRoles([]);
    setImportance('medium');
    setError(null);
  };

  const handleView = (announcementId: string) => {
    setViewedAnnouncements(prev => [...prev, announcementId]);
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'urgent':
        return <Badge variant="error" size="sm">Urgente</Badge>;
      case 'high':
        return <Badge variant="warning" size="sm">Alta</Badge>;
      case 'medium':
        return <Badge variant="primary" size="sm">Média</Badge>;
      case 'low':
        return <Badge variant="secondary" size="sm">Baixa</Badge>;
      default:
        return null;
    }
  };

  const canCreateAnnouncements = user?.role === 'admin' || user?.role === 'director';

  return (
    <div className="pb-6">
      <PageHeader 
        title="Anúncios Importantes"
        subtitle="Comunicados e informações relevantes da empresa"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              leftIcon={isSoundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            >
              {isSoundMuted ? 'Ativar Som' : 'Silenciar'}
            </Button>
            {canCreateAnnouncements && (
              <Button
                leftIcon={<Plus size={16} />}
                onClick={() => setIsModalOpen(true)}
              >
                Novo Anúncio
              </Button>
            )}
          </div>
        }
      />
      
      <div className="px-4 space-y-4">
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className={`transition-all ${
              !viewedAnnouncements.includes(announcement.id)
                ? 'border-primary-500 shadow-lg'
                : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  {getImportanceBadge(announcement.importance)}
                </div>
                <p className="text-sm text-secondary-500 mt-1">
                  {format(announcement.createdAt, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              {!viewedAnnouncements.includes(announcement.id) && (
                <Button
                  size="sm"
                  onClick={() => handleView(announcement.id)}
                >
                  Marcar como lido
                </Button>
              )}
            </div>

            <div className="mt-4 prose">
              <p>{announcement.content}</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Novo Anúncio"
        size="lg"
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
              Publicar Anúncio
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
            error={error && !title.trim() ? 'Título é obrigatório' : undefined}
          />

          <Select
            label="Nível de Importância"
            value={importance}
            onChange={(e) => setImportance(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'urgent', label: 'Urgente' }
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Conteúdo
            </label>
            <textarea
              className={`w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                error && !content.trim() 
                  ? 'border-error-300' 
                  : 'border-secondary-300'
              }`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            {error && !content.trim() && (
              <p className="mt-1 text-sm text-error-600">
                Conteúdo é obrigatório
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Público-alvo
            </label>
            <div className="space-y-2">
              {['admin', 'director', 'consultant', 'client', 'financial'].map((role) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={targetRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTargetRoles(prev => [...prev, role]);
                      } else {
                        setTargetRoles(prev => prev.filter(r => r !== role));
                      }
                    }}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            {error && targetRoles.length === 0 && (
              <p className="mt-1 text-sm text-error-600">
                Selecione pelo menos um público-alvo
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Announcements;