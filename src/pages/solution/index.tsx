
import { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import classNames from "classnames/bind";
import styles from "./Solution.module.scss";
import { getSolution, updateSolution } from "../../utils/fetchApi";
import { openNotificationWithIcon } from "../../contexts/auth";
const cx = classNames.bind(styles);

export type Solution = {
  id: string;
  title: string;
  description: string;
}

function Contact() {
  const [solution, setSolution] = useState<Solution>();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();


  const handleGetSolution = async () => {
    setLoading(true);
    try {
      const res = await getSolution();
      const resSolution = res.data[0]
      setSolution(resSolution);
      form.setFieldsValue({
        title: resSolution.title as string,
        description: resSolution.description as string,
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
      const id = solution?.id;
      await updateSolution(id as string, { ...values });
      openNotificationWithIcon(
        "success",
        "Giải pháp",
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
    handleGetSolution();
  }, [])

  return (
    <main className={cx("solution")}>
      <div className={cx("solution-form")}>
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
            <TextArea rows={8} />
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