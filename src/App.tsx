import { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button, Typography, Space, Modal, Form, Input, Select, Popconfirm, message, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CrownOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;

interface User {
  key: string;
  id: number;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Editor' | 'Viewer';
}

const initialUsers: User[] = [
  { key: '1', id: 1, nombre: 'Laura Méndez', email: 'laura.mendez@ponos.test', rol: 'Admin' },
  { key: '2', id: 2, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@ponos.test', rol: 'Editor' },
  { key: '3', id: 3, nombre: 'Ana Torres', email: 'ana.torres@ponos.test', rol: 'Viewer' },
];

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ponos_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('ponos_users', JSON.stringify(users));
  }, [users]);

  // Cálculo de métricas en tiempo real sobre la base total de usuarios
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.rol === 'Admin').length;
    const editors = users.filter((u) => u.rol === 'Editor').length;
    const viewers = users.filter((u) => u.rol === 'Viewer').length;
    return { total, admins, editors, viewers };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchText =
        user.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase());
      const matchRole = selectedRole === 'all' || user.rol === selectedRole;
      return matchText && matchRole;
    });
  }, [users, searchText, selectedRole]);

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    message.success('Usuario eliminado correctamente');
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleFinish = (values: { nombre: string; email: string; rol: 'Admin' | 'Editor' | 'Viewer' }) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)));
      message.success('Usuario actualizado correctamente');
    } else {
      const newUser: User = {
        key: Date.now().toString(),
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        ...values,
      };
      setUsers([...users, newUser]);
      message.success('Usuario creado con éxito');
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      message.warning('No hay usuarios para exportar');
      return;
    }

    const headers = ['ID', 'Nombre', 'Email', 'Rol'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.nombre.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${u.rol}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'usuarios_ponos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success('Reporte CSV descargado con éxito');
  };

  const columns: ColumnsType<User> = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 70, 
      align: 'center' 
    },
    { 
      title: 'Nombre', 
      dataIndex: 'nombre', 
      key: 'nombre', 
      width: 180 
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email', 
      width: 260 
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      width: 120,
      align: 'center',
      render: (rol: string) => {
        const color = rol === 'Admin' ? 'red' : rol === 'Editor' ? 'blue' : 'green';
        return <Tag color={color}>{rol}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => openEditModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que quieres eliminar este usuario?"
            okText="Sí, eliminar"
            cancelText="Cancelar"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2} style={{ margin: 0 }}>Gestión de Usuarios - Prácticas Ponos</Title>
        <Space>
          <Button onClick={exportToCSV}>
            Descargar CSV
          </Button>
          <Button type="primary" onClick={openCreateModal}>
            Nuevo Usuario
          </Button>
        </Space>
      </div>

      {/* Tarjetas de Estadísticas */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#fafafa' }}>
            <Statistic title="Total Usuarios" value={stats.total} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#fff1f0' }}>
            <Statistic title="Admins" value={stats.admins} valueStyle={{ color: '#cf1322' }} prefix={<CrownOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#e6f7ff' }}>
            <Statistic title="Editores" value={stats.editors} valueStyle={{ color: '#096dd9' }} prefix={<EditOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#f6ffed' }}>
            <Statistic title="Viewers" value={stats.viewers} valueStyle={{ color: '#389e0d' }} prefix={<EyeOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Barra de Filtros */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={16}>
            <Search
              placeholder="Buscar por nombre o correo electrónico..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              style={{ width: '100%' }}
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              options={[
                { value: 'all', label: 'Todos los roles' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Editor', label: 'Editor' },
                { value: 'Viewer', label: 'Viewer' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Table dataSource={filteredUsers} columns={columns} pagination={{ pageSize: 5 }} />

      <Modal
        title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText={editingUser ? 'Actualizar' : 'Guardar'}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingresa el nombre' }]}>
            <Input placeholder="Ej. Juan Pérez" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Ingresa un email válido' }]}>
            <Input placeholder="Ej. juan@ponos.test" />
          </Form.Item>
          <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Selecciona un rol' }]}>
            <Select
              placeholder="Selecciona un rol"
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Editor', label: 'Editor' },
                { value: 'Viewer', label: 'Viewer' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}