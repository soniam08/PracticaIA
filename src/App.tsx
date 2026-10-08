import { useState, useEffect } from 'react';
import { Table, Tag, Button, Typography, Space, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('ponos_users', JSON.stringify(users));
  }, [users]);

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('Usuario eliminado correctamente');
  };

  const handleAddUser = (values: { nombre: string; email: string; rol: 'Admin' | 'Editor' | 'Viewer' }) => {
    const newUser: User = {
      key: Date.now().toString(),
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...values,
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Usuario creado con éxito');
  };

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol: string) => {
        const color = rol === 'Admin' ? 'red' : rol === 'Editor' ? 'blue' : 'green';
        return <Tag color={color}>{rol}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
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

      <Table dataSource={users} columns={columns} pagination={{ pageSize: 5 }} />

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