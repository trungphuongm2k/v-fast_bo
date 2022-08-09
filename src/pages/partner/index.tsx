import { useEffect, useState } from "react";
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
import { partners, uploadFile } from "../../utils/fetchApi";
const cx = classNames.bind(styles);

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  img: string;
  url: string;
}

function Partner() {
  const [dataPartner, setDataPartner] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  console.log("render");
  const handleConfirm = () => {
    console.log("okee");
  };

  const handleCancelAdd = () => {
    setOpenModalAdd(false);
  };
  const onFinish = async (values: any) => {
    console.log(values.image[0].originFileObj);
    let bodyFormData = new FormData();
    bodyFormData.append("file", values.image[0].originFileObj);
    const res = await uploadFile(bodyFormData);
    console.log(res);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await partners();
        setDataPartner(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
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
            onClick={() => {
              console.log(id);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            placement="top"
            title="Bạn muốn xóa bản ghi này?"
            onConfirm={handleConfirm}
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
        <img className={cx("img-partner")} src={img} alt="partner" />
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
    console.log("Upload event:", e);
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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
                name="logo"
                listType={"picture-card"}
                maxCount={1}
                showUploadList={{ showPreviewIcon: false }}
                accept="image/png"
              >
                <Button icon={<UploadOutlined />}></Button>
              </Upload>
            </Form.Item>
            <input
              type="file"
              name="datafile"
              onChange={(e) => console.log(e.target.files)}
            />
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
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

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
