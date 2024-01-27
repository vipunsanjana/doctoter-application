import React from 'react'
import { Button, Form, Input } from 'antd';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios'


function RegistrationForm() {


    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
          
            const response = await axios.post("http://localhost:3001/api/user/register",values);
           
            if(response.data.success){
                console.log("success");
                navigate("/login");
            }else{
                console.log("error");
            }
        } catch (error) {
            
            console.log("smething went wrong.");
        }
    }

    return (
        <div className="authentication">

            <div className="authentication-form card p-3">

                <h1 className='card-title'>Nice To Meet U</h1>

                <Form layout='vertical' onFinish={onFinish}>

       
                    <Form.Item label="Email" name="email">
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input placeholder='Password' />
                    </Form.Item>

                    <Button className='primary-button mt-3' htmlType='submit'>REGISTER</Button>

                    <Link to="/login" className='anchor mt-2'>I HAVE A ACCOUNT.LOGIN NOW...</Link>
                    <Link to="/add-appin" className='anchor mt-2'>Appointment</Link>

                </Form>

            </div>

        </div>
    )
}

export default RegistrationForm