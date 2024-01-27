import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddDoctor = () => {
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');

      // Create a FormData object to handle file uploads
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      fileList.forEach((file) => {
        formData.append('image', file.originFileObj);
      });

      // Use the token in the axios.post request
      const response = await axios.post("http://localhost:3001/api/admin/create-doctor", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set content type for file uploads
        },
      });

      if (response.data.success) {
        console.log("Doctor created successfully!");
        // Handle success, e.g., redirect or show a success message
      } else {
        console.log("Error creating doctor:");
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      // Handle error, e.g., show an error message
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Description is required' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Price is required' }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item label="From" name="from" rules={[{ required: true, message: 'From is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="To" name="to" rules={[{ required: true, message: 'To is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Date is required' }]}>
        <DatePicker />
      </Form.Item>
      {/* Image Upload */}
      <Form.Item
        label="Upload Image"
        name="image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Image is required' }]}
      >
        <Upload
          beforeUpload={() => false} // Prevent automatic upload, handle it in onFinish
          listType="picture"
          onChange={onFileChange}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Doctor
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddDoctor;
