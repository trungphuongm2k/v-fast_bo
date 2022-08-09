import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/auth";
import styles from "./Header.module.scss";
import { Button, Form, Input } from "antd";
const cx = classNames.bind(styles);

function Header(): JSX.Element {
  const { pathname } = useRouter();
  const [checkPageLogin, setCheckPageLogin] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, Logout, ChangePassword } = useAuth();
  const handleCheckChangePass = (option: string) => {
    if (option == "logout") {
      if (!changePass) return;
      setChangePass(false);
    }
    if (option == "changepass") {
      if (changePass) return;
      setChangePass(true);
    }
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    const { currentpassword, newpassword } = values;
    await ChangePassword({ id: user?.id || "", currentpassword, newpassword });
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (pathname != "/login") {
      setCheckPageLogin(true);
    } else {
      setCheckPageLogin(false);
    }
  }, [pathname]);
  return (
    <>
      {checkPageLogin && (
        <>
          <header className={cx("header")}>
            <div className={cx("header-profile")}>
              <div className={cx("header-profile_show")}>
                <h2>{user && user.name}</h2>
                <LogoutOutlined className={cx("header-profile_icon")} />
              </div>
              <div
                className={cx(
                  "header-profile_hover",
                  `${changePass ? "is-change-pass" : ""}`
                )}
              >
                <div className={cx("header-profile_control")}>
                  <span
                    className={cx(`${!changePass ? "active" : ""}`)}
                    onClick={() => handleCheckChangePass("logout")}
                  >
                    Đăng xuất
                  </span>
                  <span
                    className={cx(`${changePass ? "active" : ""}`)}
                    onClick={() => handleCheckChangePass("changepass")}
                  >
                    Đổi mật khẩu
                  </span>
                </div>
                <div className={cx("header-profile_main")}>
                  {!changePass ? (
                    <div className={cx("header-profile_logout")}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => Logout()}
                      >
                        Đăng xuất
                      </Button>
                    </div>
                  ) : (
                    <div className={cx("header-profile_changepass")}>
                      <Form
                        name="basic"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                      >
                        <Form.Item
                          label="Mật khẩu hiện tại"
                          name="currentpassword"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không bỏ trống!",
                            },
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>

                        <Form.Item
                          label="Mật khẩu mới"
                          name="newpassword"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không bỏ trống!",
                            },
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                          >
                            Đổi mật khẩu
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        </>
      )}
    </>
  );
}

export default Header;
