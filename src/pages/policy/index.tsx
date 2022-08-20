import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import classNames from "classnames/bind";
import { Button } from "antd";
import styles from "./Policy.module.scss";
import { getPolicy, updatePolicy } from "../../utils/fetchApi";
import { openNotificationWithIcon } from "../../contexts/auth";
const cx = classNames.bind(styles);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ align: ["", "center", "right", "justify"] }],
    [
      "link",
      "image",
      {
        color: [
          "#000000d9",
          "#fff",
          "red",
          "#ff4d4f",
          "#ee5c12",
          "blue",
          "#52c41a",
          "#40a9ff",
          "yellow",
        ],
      },
      {
        background: [
          "",
          "#000000d9",
          "#fff",
          "red",
          "#ff4d4f",
          "#ee5c12",
          "blue",
          "#52c41a",
          "#40a9ff",
          "yellow",
        ],
      },
    ],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "align",
  "background"
];
export type typePolicy = {
  id: string;
  content: string;
};

function Policy() {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [policy, setPolicy] = useState<typePolicy>();

  const handleGetPolicy = async () => {
    setLoading(true);
    setDisabledButton(true);
    try {
      const res = await getPolicy();
      setPolicy(res.data[0]);
      setValue(res.data[0].content);
      setDisabledButton(false);
    } catch (error: any) {
      console.log(error);
      openNotificationWithIcon("error", "Lỗi", error?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdatePolicy = async () => {
    setLoading(true);
    try {
      const id = policy?.id;
      await updatePolicy(id as string, { content: value });
      openNotificationWithIcon(
        "success",
        "Chính sách",
        "Cập nhật thành công!!"
      );
    } catch (error: any) {
      console.log(error);
      openNotificationWithIcon("error", "Lỗi", error?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetPolicy();
  }, []);

  return (
    <main className={cx("policy")}>
      <div className={cx("policy-button")}>
        <Button
          type="primary"
          size={"large"}
          loading={loading}
          disabled={disabledButton}
          onClick={() => handleUpdatePolicy()}
        >
          Cập nhật chính sách
        </Button>
      </div>
      <div className={cx("policy-editor")}>
        <ReactQuill
          placeholder="Nhập nội dung chính sách trang."
          preserveWhitespace={true}
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
        />
      </div>
    </main>
  );
}

export default Policy;
