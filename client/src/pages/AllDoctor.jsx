import React, { useEffect, useState } from 'react';
import { Table, Space, Button } from 'antd';
import axios from 'axios';


const AllDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3001/api/admin/get-all-doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          console.log('Error fetching doctors:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Start time',
      dataIndex: 'adjustedFrom',
      key: 'adjustedFrom',
      
    },
    {
      title: 'Doctor Photo',
      dataIndex: 'image',
      key: 'image',
      render: (image) => {
        if (image && image.data && image.contentType) {
          return (
            <img
              src={`data:${image.contentType};base64,${image.data}`}
              alt="Doctor"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          );
        } else {
          return <span>No Photo</span>;
        }
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {/* Replace anchor tags with buttons */}
          <Button type="link" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Example functions for edit and delete
  const handleEdit = (doctorId) => {
    // Implement your edit logic here
    console.log('Edit doctor with ID:', doctorId);
  };

  const handleDelete = (doctorId) => {
    // Implement your delete logic here
    console.log('Delete doctor with ID:', doctorId);
  };

  return (
    <Table
      dataSource={doctors}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default AllDoctor;
