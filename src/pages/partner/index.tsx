import { useEffect, useState, useRef } from "react";
import styles from "./Partner.module.scss";
import classNames from "classnames/bind";
import { Button, Form, Modal, Popconfirm, Table, Input, Upload } from "antd";
import {
  EditFilled,
  DeleteFilled,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  partners,
  uploadFile,
  addPartner,
  deletePartner,
  updateOnePartner,
} from "../../utils/fetchApi";
import { openNotificationWithIcon } from "../../contexts/auth";
import Image from "next/image";
const cx = classNames.bind(styles);

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  img: string;
  url: string;
}

export interface AddPartner {
  name: string;
  img: string;
  url: string;
}

function Partner() {
  const [dataPartner, setDataPartner] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [loadingAddPartner, setLoadingAddPartner] = useState<boolean>(false);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [updatePartner, updateDataPartner] = useState<DataType>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [loadingUpdatePartner, setLoadingUpdatePartner] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const handleGetPartner = async () => {
    try {
      setLoading(true);
      const res = await partners();
      setDataPartner(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeletePartner = async (id: string) => {
    setConfirmLoading(true);
    try {
      const res = await deletePartner(id);
      console.log(res);
      openNotificationWithIcon(
        "success",
        "Xóa đối tác",
        "Xóa đối tác thành công!"
      );
      setDataPartner(dataPartner.filter((partner) => partner.id !== id));
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Xóa đối tác", "Xóa đối tác thất bại!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setOpenModalAdd(false);
  };
  const handleCancelUpdate = () => {
    setOpenModalUpdate(false);
  };
  const onFinishAdd = async (values: any) => {
    setLoadingAddPartner(true);
    try {
      let bodyFormData = new FormData();
      bodyFormData.append("file", values.image[0].originFileObj);
      const resImg = await uploadFile(bodyFormData);
      const img = resImg.data.path;
      const { name, url } = values;
      const res = await addPartner({ name, img, url });
      console.log(res);
      openNotificationWithIcon(
        "success",
        "Đối tác",
        "Thêm đối tác thành công!"
      );
      handleGetPartner();
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Đối tác", "Thêm đối tác thất bại!");
    } finally {
      setLoadingAddPartner(false);
    }
  };
  const onFinishUpdate = async (values: any) => {
    setLoadingUpdatePartner(true);
    try {
      let img = updatePartner?.img as string;
      if (values.image) {
        let bodyFormData = new FormData();
        bodyFormData.append("file", values.image[0].originFileObj);
        const resImg = await uploadFile(bodyFormData);
        img = resImg.data.path;
      }
      const id = updatePartner?.id as string;
      const { name, url } = values;
      const res = await updateOnePartner(id, { name, img, url });
      console.log(res);
      openNotificationWithIcon(
        "success",
        "Đối tác",
        "Sửa thông tin đối tác thành công!"
      );
      handleGetPartner();
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        "error",
        "Đối tác",
        "Sửa thông tin đối tác thất bại!"
      );
    } finally {
      setLoadingUpdatePartner(false);
    }
  };
  const onFinishAddFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishUpdateFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleOpenModalUpdate = (id: string) => {
    const checkPartner = dataPartner.filter((partner) => partner.id === id)[0];
    updateDataPartner(checkPartner);
    form.setFieldsValue({
      name: checkPartner.name,
      url: checkPartner.url,
    });
    setOpenModalUpdate(true);
  };
  useEffect(() => {
    handleGetPartner();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Hành động",
      dataIndex: "id",
      width: 200,
      render: (id: string) => (
        <div key={id}>
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={() => handleOpenModalUpdate(id)}
          >
            Sửa
          </Button>
          <Popconfirm
            placement="top"
            title="Bạn muốn xóa bản ghi này?"
            onConfirm={() => handleConfirmDeletePartner(id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: confirmLoading }}
          >
            <Button type="primary" icon={<DeleteFilled />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "img",
      width: 250,
      render: (img: string) => (
        <div className={cx("img-partner")}>
          <Image
            src={process.env.HOST_NAME_API + img}
            alt="partner"
            layout="fill"
          />
        </div>
      ),
    },
    {
      title: "Đường dẫn tới trang",
      dataIndex: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
  ];
  const normFile = (e: any) => {
    console.log(e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const normUpdateFile = (e: any) => {
    console.log(e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <main className={cx("partner")}>
      <div className={cx("partner-head")}>
        <h1>Quản lý danh sách đối tác</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusCircleFilled />}
          onClick={() => {
            setOpenModalAdd(true);
          }}
        >
          Thêm bản ghi
        </Button>
        <Modal
          title="Thêm đối tác"
          visible={openModalAdd}
          onCancel={handleCancelAdd}
          footer={[
            <Button key="back" onClick={handleCancelAdd}>
              Cancel
            </Button>,
          ]}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinishAdd}
            onFinishFailed={onFinishAddFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Tên đối tác"
              name="name"
              rules={[{ required: true, message: "Không bỏ trống!!!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="image"
              label="Ảnh đại điện"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Không bỏ trống!!!" }]}
            >
              <Upload
                listType={"picture-card"}
                maxCount={1}
                multiple={false}
                showUploadList={{
                  showPreviewIcon: false,
                  showDownloadIcon: false,
                }}
                beforeUpload={() => {
                  return false;
                }}
                withCredentials={false}
                accept="image/png, image/jpeg"
              >
                <Button icon={<UploadOutlined />}></Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="url"
              label="URL"
              rules={[
                { required: true, message: "Không bỏ trống!!!" },
                {
                  type: "url",
                  warningOnly: true,
                  message: "Không phải url!!!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingAddPartner}
              >
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Modal
        title="Sửa đối tác"
        visible={openModalUpdate}
        onCancel={handleCancelUpdate}
        footer={[
          <Button key="back" onClick={handleCancelUpdate}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishUpdateFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên đối tác"
            name="name"
            rules={[{ required: true, message: "Không bỏ trống!!!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Sửa hình ảnh thành"
            valuePropName="fileList"
            getValueFromEvent={normUpdateFile}
          >
            <Upload
              listType={"picture-card"}
              maxCount={1}
              multiple={false}
              showUploadList={{
                showPreviewIcon: false,
                showDownloadIcon: false,
              }}
              beforeUpload={() => {
                return false;
              }}
              withCredentials={false}
              accept="image/png, image/jpeg"
            >
              <Button icon={<UploadOutlined />}></Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="url"
            label="URL"
            rules={[
              { required: true, message: "Không bỏ trống!!!" },
              {
                type: "url",
                warningOnly: true,
                message: "Không phải url!!!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingUpdatePartner}
            >
              Sửa
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={dataPartner}
        tableLayout={"auto"}
        scroll={{ x: 900 }}
        loading={loading}
        rowKey="id"
      />
    </main>
  );
}

export default Partner;
