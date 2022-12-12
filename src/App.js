import { useState } from 'react'
import { Form, Button, Checkbox, Input, DatePicker, Select, Descriptions } from 'antd'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import './App.css';

function App() {
  const [formData, setFormData] = useState([]);
  const { Option } = Select;
  const schema = yup.object({
    email: yup.string().email("it is not email!").min(15).required(),
    password: yup.string().matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}/, { excludeEmptyString: true }).required(),
    remember: yup.boolean().oneOf([true]),
    dateCreated: yup.date().max(Date()),
    gender: yup.string().oneOf(['male', 'female'])
  }).required()

  const { handleSubmit, control, formState: { errors, isValid } } = useForm({
    defaultValues: {
      remember: false
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    const {dateCreated,...rest} = data;
    setFormData([...formData,{...rest,dateCreated:dateCreated.toLocaleDateString()}])
  }
  return (
    <div className='App'>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          validateStatus={errors.email && "error"}
          hasFeedback
          help={errors.email && errors.email.message}
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          validateStatus={errors.password && "error"}
          help={errors.password && "password wrong!"}
        >
          <Controller
            name='password'
            control={control}
            render={({ field }) => <Input.Password {...field} autoComplete="new-password" />}
          />

        </Form.Item>

        <Form.Item label="Gender" hasFeedback validateStatus={errors.gender && "error"}>
          <Controller
            name='gender'
            control={control}
            render={({ field }) =>
              <Select {...field} placeholder="Select gender" allowClear>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>}
          />
        </Form.Item>

        <Form.Item name="dateCreated" label="Date created"
          validateStatus={errors.dateCreated && "error"}
          help={errors.dateCreated && "date invaled"}>
          <Controller
            name="dateCreated"
            control={control}
            render={({ field }) => <DatePicker {...field} />}
          />
        </Form.Item>


        <Form.Item name="remember" wrapperCol={{ offset: 8, span: 16 }}>
          <Controller
            name='remember'
            control={control}
            render={({ field }) => <Checkbox {...field} >Remember me</Checkbox>}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={!isValid} >
            Submit
          </Button>
        </Form.Item>
      </Form>
      {
        formData.map((user, index) => {
          return <Descriptions title="User Info" key={index}>
            <Descriptions.Item label="Email"> : {user.email}</Descriptions.Item>
            <Descriptions.Item label="Password"> : {user.password}</Descriptions.Item>
            <Descriptions.Item label="Gender"> : {user.gender}</Descriptions.Item>
            <Descriptions.Item label="Date created"> : {user.dateCreated}</Descriptions.Item>
            <Descriptions.Item label="Remember"> : {user.remember && "checked"}</Descriptions.Item>
          </Descriptions>
        })
      }

    </div>
  )
}

export default App;
