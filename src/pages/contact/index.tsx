
import { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import classNames from "classnames/bind";
import styles from "./Contact.module.scss";
import { getContact, updateContact } from "../../utils/fetchApi";
import { openNotificationWithIcon } from "../../contexts/auth";
const cx = classNames.bind(styles);

export type Contact = {
  id: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  add: string;
}

function Contact() {
  const [contact, setContact] = useState<Contact>();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();


  const handleGetContact = async () => {
    setLoading(true);
    try {
      const res = await getContact();
      const resContact = res.data[0]
      setContact(resContact);
      form.setFieldsValue({
        title: resContact.title as string,
        description: resContact.description as string,
        phone: resContact.phone as string,
        email: resContact.email as string,
        add: resContact.add as string,
      });
    } catch (error: any) {
      console.log(error);
      openNotificationWithIcon("error", "Lỗi", error?.message);
    } finally {
      setLoading(false);
    }
  }


  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const id = contact?.id;
      await updateContact(id as string, { ...values });
      openNotificationWithIcon(
        "success",
        "Liên hệ",
        "Cập nhật thành công!!"
      );
    } catch (error: any) {
      console.log(error);
      openNotificationWithIcon("error", "Lỗi", error?.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    handleGetContact();
  }, [])

  return (
    <main className={cx("contact")}>
      <div className={cx("contact-form")}>
        <h1>Thông tin liên hệ</h1>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng không bỏ trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng không bỏ trống!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng không bỏ trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng không bỏ trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="add"
            rules={[{ required: true, message: 'Vui lòng không bỏ trống!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}

export default Contact;