import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames/bind";
import styles from "./Service.module.scss";
import { Button, Form, Modal, Popconfirm, Table, Input, Upload } from "antd";
import {
  EditFilled,
  DeleteFilled,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  services,
  uploadFile,
  addService,
  deleteService,
  updateOneService,
} from "../../utils/fetchApi";
import { openNotificationWithIcon } from "../../contexts/auth";
import TextArea from "antd/lib/input/TextArea";
const cx = classNames.bind(styles);

interface DataType {
  key: React.Key;
  id: string;
  img: string;
  title: string;
  description: string;
}

export interface AddService {
  img: string;
  title: string;
  description: string;
}

function Service() {
  const [dataService, setDataService] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [loadingAddService, setLoadingAddService] = useState<boolean>(false);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [updateService, setUpdateService] = useState<DataType>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [loadingUpdateService, setLoadingUpdateService] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const handleGetService = async () => {
    try {
      setLoading(true);
      const res = await services();
      setDataService(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteService = async (id: string) => {
    setConfirmLoading(true);
    try {
      const res = await deleteService(id);
      console.log(res);
      openNotificationWithIcon(
        "success",
        "Xóa dịch vụ",
        "Xóa dịch vụ thành công!"
      );
      setDataService(dataService.filter((service) => service.id !== id));
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Xóa dịch vụ", "Xóa dịch vụ thất bại!");
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
    setLoadingAddService(true);
    try {
      let bodyFormData = new FormData();
      bodyFormData.append("file", values.image[0].originFileObj);
      const resImg = await uploadFile(bodyFormData);
      const img = resImg.data.path;
      const { title, description } = values;
      const res = await addService({ img, title, description });
      console.log(res);
      openNotificationWithIcon(
        "success",
        "Dịch vụ",
        "Thêm bản ghi thành công!"
      );
      handleGetService();
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Dịch vụ", "Thêm bản ghi thất bại!");
    } finally {
      setLoadingAddService(false);
    }
  };
  const onFinishUpdate = async (values: any) => {
    setLoadingUpdateService(true);
    try {
      let img = updateService?.img as string;
      if (values.image) {
        let bodyFormData = new FormData();
        bodyFormData.append("file", values.image[0].originFileObj);
        const resImg = await uploadFile(bodyFormData);
        img = resImg.data.path;
      }
      const id = updateService?.id as string;
      const { title, description } = values;
      const res = await updateOneService(id, { img, title, description });
      console.log(res);
      openNotificationWithIcon(
        "success",
        "Dịch vụ",
        "Sửa thông tin dịch vụ thành công!"
      );
      handleGetService();
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        "error",
        "Dịch vụ",
        "Sửa thông tin dịch vụ thất bại!"
      );
    } finally {
      setLoadingUpdateService(false);
    }
  };
  const onFinishAddFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishUpdateFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleOpenModalUpdate = (id: string) => {
    const checkService = dataService.filter((service) => service.id === id)[0];
    setUpdateService(checkService);
    form.setFieldsValue({
      title: checkService.title,
      description: checkService.description,
    });
    setOpenModalUpdate(true);
  };
  useEffect(() => {
    handleGetService();
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////
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
            onConfirm={() => handleConfirmDeleteService(id)}
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
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "img",
      width: 250,
      render: (img: string) => (
        <div className={cx("img-service")}>
          <img
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            src={process.env.HOST_NAME_API + img}
            alt="partner"
          />
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
  //////////////////////////////////////////////////////////////////
  return (
    <main className={cx("service")}>
      <div className={cx("service-head")}>
        <h1>Quản lý danh sách dịch vụ</h1>
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
              label="Tiêu đề"
              name="title"
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
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Không bỏ trống!!!" }]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingAddService}
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
            label="Tiêu đề"
            name="title"
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
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Không bỏ trống!!!" }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingUpdateService}
            >
              Sửa
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={dataService}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15"],
        }}
        tableLayout={"auto"}
        scroll={{ x: 900 }}
        loading={loading}
        rowKey="id"
      />
    </main>
  );
}

export default Service;
<>
  <h1>okee</h1>
</>;
