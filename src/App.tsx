import { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button, Typography, Space, Modal, Form, Input, Select, Popconfirm, message, Card, Row, Col } from 'antd';
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
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('ponos_users', JSON.stringify(users));
  }, [users]);

  // Filtro combinado de búsqueda por texto y rol
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

  const handleAddUser = (values: { nombre: string; email: string; rol: 'Admin' | 'Editor' | 'Viewer' }) => {
    const newUser: User = {
      key: Date.now().toString(),
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      ...values,
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Usuario creado con éxito');
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
          <Button type="link" onClick={() => message.info(`Editando a ${record.nombre}`)}>
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
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Nuevo Usuario
        </Button>
      </div>

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
        title="Crear Nuevo Usuario"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
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