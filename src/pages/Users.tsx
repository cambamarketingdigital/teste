import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, THead, TBody, Tr, Th, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { UserPlus, Download, Filter, Search, UserCog, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

// Validation schema
const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.enum(['client', 'consultant', 'director', 'financial', 'admin', 'traffic_manager']),
  accessCode: z.string().optional(),
  companyName: z.string().optional(),
  document: z.string().optional(),
  whatsapp: z.string().optional()
});

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client');
  const [accessCode, setAccessCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [document, setDocument] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    }
  };

  const handleCreateUser = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = userSchema.parse({
        email,
        password,
        name,
        role,
        accessCode,
        companyName,
        document,
        whatsapp
      });

      const { data, error } = await supabase.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password,
        user_metadata: {
          name: validatedData.name,
          role: validatedData.role,
          companyName: validatedData.companyName,
          document: validatedData.document,
          whatsapp: validatedData.whatsapp
        }
      });

      if (error) throw error;

      // Add new user to the list
      if (data.user) {
        setUsers(prev => [data.user, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar usuário');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
      if (error) throw error;

      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, {
        user_metadata: { ...selectedUser.user_metadata, role: newRole }
      });

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole }
          : user
      ));

      setIsPromoteModalOpen(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar função do usuário');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('client');
    setAccessCode('');
    setCompanyName('');
    setDocument('');
    setWhatsapp('');
    setError(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="error" size="sm">Administrador</Badge>;
      case 'director':
        return <Badge variant="primary" size="sm">Diretor</Badge>;
      case 'consultant':
        return <Badge variant="success" size="sm">Consultor</Badge>;
      case 'client':
        return <Badge variant="secondary" size="sm">Cliente</Badge>;
      case 'financial':
        return <Badge variant="warning" size="sm">Financeiro</Badge>;
      case 'traffic_manager':
        return <Badge variant="primary" size="sm">Tráfego</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.companyName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="pb-6">
      <PageHeader 
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
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
              Novo Usuário
            </Button>
          </div>
        }
      />
      
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Total de Usuários</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">{users.length}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Consultores</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {users.filter(u => u.role === 'consultant').length}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Diretores</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {users.filter(u => u.role === 'director').length}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-secondary-500">Clientes</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {users.filter(u => u.role === 'client').length}
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Buscar usuário..."
              leftIcon={<Search size={16} className="text-secondary-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-error-50 rounded-lg flex items-center text-error-600">
              <AlertCircle size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          )}

          <Table hoverable>
            <THead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Função</Th>
                <Th>Empresa</Th>
                <Th>CNPJ/CPF</Th>
                <Th>WhatsApp</Th>
                <Th>Data Cadastro</Th>
                {currentUser?.role === 'admin' && <Th>Ações</Th>}
              </Tr>
            </THead>
            <TBody>
              {filteredUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{getRoleBadge(user.role)}</Td>
                  <Td>{user.companyName || '-'}</Td>
                  <Td>{user.document || '-'}</Td>
                  <Td>{user.whatsapp || '-'}</Td>
                  <Td>{formatDate(user.created_at)}</Td>
                  {currentUser?.role === 'admin' && (
                    <Td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                            setIsPromoteModalOpen(true);
                          }}
                        >
                          <UserCog size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-error-500 hover:bg-error-50"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Td>
                  )}
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* New User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Novo Usuário"
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
            <Button
              onClick={handleCreateUser}
              isLoading={isLoading}
            >
              Criar Usuário
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Select
            label="Função"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'client', label: 'Cliente' },
              { value: 'consultant', label: 'Consultor' },
              { value: 'director', label: 'Diretor' },
              { value: 'financial', label: 'Financeiro' },
              { value: 'traffic_manager', label: 'Tráfego' },
              { value: 'admin', label: 'Administrador' }
            ]}
          />

          {role !== 'client' && (
            <Input
              label="Código de acesso"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
              helperText="Necessário para cadastro de consultores, diretores e administradores"
            />
          )}

          {role === 'client' && (
            <>
              <Input
                label="Nome da Empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <Input
                label="CNPJ/CPF"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
              />

              <Input
                label="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </>
          )}

          {error && (
            <div className="p-3 rounded-md bg-error-50 text-error-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </Modal>

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
              onClick={handleDeleteUser}
            >
              Excluir
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-secondary-700">
            Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
          </p>
          <p className="text-sm text-error-600">
            Esta ação não pode ser desfeita!
          </p>
        </div>
      </Modal>

      {/* Role Change Modal */}
      <Modal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        title="Alterar Função do Usuário"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPromoteModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRoleChange}>
              Confirmar Alteração
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">
            Usuário: <strong>{selectedUser?.name}</strong>
          </p>
          
          <Select
            label="Nova Função"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={[
              { value: 'client', label: 'Cliente' },
              { value: 'consultant', label: 'Consultor' },
              { value: 'director', label: 'Diretor' },
              { value: 'financial', label: 'Financeiro' },
              { value: 'traffic_manager', label: 'Tráfego' },
              { value: 'admin', label: 'Administrador' }
            ]}
          />

          <div className="p-3 bg-warning-50 rounded-lg">
            <p className="text-sm text-warning-700">
              <strong>Atenção:</strong> Alterar a função do usuário pode afetar suas permissões e acesso ao sistema.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;