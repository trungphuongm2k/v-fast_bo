import { useEffect, useState } from "react";
import Link from "next/link";
import classNames from "classnames/bind";
import { useRouter } from "next/router";
import {
  HomeOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  TeamOutlined,
  ReadOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import styles from "./Navbar.module.scss";
const cx = classNames.bind(styles);
function Navbar() {
  const navList = [
    {
      id: 1,
      title: "Trang chủ",
      url: "/",
      icon: <HomeOutlined />,
    },
    {
      id: 2,
      title: "Thông tin chung",
      url: "/info",
      icon: <InfoCircleOutlined />,
    },
    {
      id: 3,
      title: "Danh sách đối tác",
      url: "/partner",
      icon: <TeamOutlined />,
    },
    {
      id: 4,
      title: "Liên hệ",
      url: "/contact",
      icon: <ContactsOutlined />,
    },
    {
      id: 5,
      title: "Chính sách",
      url: "/policy",
      icon: <ReadOutlined />,
    },
  ];
  const [checkPageLogin, setCheckPageLogin] = useState(false);
  const { pathname } = useRouter();

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
        <div className={cx("nav")}>
          <div className={cx("nav-container")}>
            <div className={cx("nav-active")}>
              <DoubleRightOutlined className={cx("nav-active_right")} />
              <DoubleLeftOutlined className={cx("nav-active_left")} />
            </div>
            <div className={cx("nav-logo")}>
              <img
                className={cx("nav-logo_small")}
                src="/vfast-logo.png"
                alt="logo vfast"
              />
              <img
                className={cx("nav-logo_full")}
                src="/vfast-logo-full.png"
                alt="logo vfast"
              />
            </div>
            <nav>
              <ul>
                {navList.map((item) => {
                  return (
                    <Link key={item.id} href={item.url}>
                      <li
                        className={cx(
                          `${pathname == item.url ? "active" : ""}`
                        )}
                      >
                        <div className={cx("nav-icon")}>{item.icon}</div>
                        <span>{item.title}</span>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
