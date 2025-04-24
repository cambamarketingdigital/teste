import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { Save, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (newPassword && newPassword !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      await updateProfile({
        name,
        nickname,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        avatarUrl: avatarUrl || undefined
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Configurações do Perfil"
        subtitle="Atualize suas informações pessoais"
      />
      
      <div className="px-4">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar
                  src={avatarUrl}
                  initials={(nickname || name).slice(0, 2)}
                  size="xl"
                />
                <label className="absolute bottom-0 right-0 p-1 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
                  <Camera size={16} className="text-secondary-900" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary-900">Foto do Perfil</h3>
                <p className="text-sm text-secondary-500">
                  Clique no ícone da câmera para alterar sua foto
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Apelido"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Como você quer ser chamado?"
              />
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Alterar Senha</h3>
              
              <Input
                label="Senha Atual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nova Senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-error-50 text-error-600 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-md bg-success-50 text-success-600 text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
                leftIcon={<Save size={16} />}
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;