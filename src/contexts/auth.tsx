import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { notification } from "antd";
import { login, whoAmI, resetPassword } from "../utils/fetchApi";

type NotificationType = "success" | "info" | "warning" | "error";
export const openNotificationWithIcon = (
  type: NotificationType,
  title: string,
  message: string
) => {
  notification[type]({
    message: title,
    description: message,
    placement: "top",
    duration: 2,
  });
};
export type User = {
  name?: string | undefined;
  id: string | undefined;
};
export type UserLogin = {
  email: string;
  password: string;
};
export type ChangePassWord = {
  id: string;
  currentpassword: string;
  newpassword: string;
};
export type GlobalContent = {
  user: User;
  loading: boolean;
  Logout: () => void;
  ChangePassword: (value: ChangePassWord) => Promise<void>;
  SetLoading: (islogin: boolean) => void;
  Login: (userLogin: UserLogin) => Promise<void>;
  authenticate: () => Promise<void>;
};
export const getStoreLocal = (item: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(item);
  }
};
export const removeStoreLocal = (item: string) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(item);
  }
};
export const setStoreLocal = (item: string, token: string) => {
  if (typeof window !== "undefined") {
    return localStorage.setItem(item, token);
  }
};

const AuthContext = createContext<GlobalContent>({} as GlobalContent);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { push } = useRouter();

  const Logout = () => {
    removeStoreLocal("id");
    setUser(null);
    push("/login");
  };

  const ChangePassword = async (value: ChangePassWord) => {
    try {
      const res = await resetPassword(value);
      openNotificationWithIcon("success", "Đổi mật khẩu thành công", res.data);
    } catch (error) {
      console.log({ error });
      openNotificationWithIcon("error", "Đổi mật khẩu", "Không thành công!");
    }
  };
  const Login = async (userLogin: UserLogin) => {
    try {
      const res = await login(userLogin);
      const { token } = res.data;
      setStoreLocal("id", token);
      await authenticate();
      push("/");
      openNotificationWithIcon("success", "Đăng nhập", "Đăng nhập thành công!");
    } catch (error) {
      console.log({ error });
      openNotificationWithIcon("error", "Đăng nhập", "Đăng nhập thất bại!");
    }
  };
  const SetLoading = (islogin: boolean) => {
    setLoading(islogin);
  };
  const authenticate = async () => {
    try {
      const res = await whoAmI();
      setUser(res.data);
    } catch (error) {
      removeStoreLocal("id");
      push("/login");
      console.log({ error });
    }
  };
  useEffect(() => {
    const token = getStoreLocal("id");
    if (!token) {
      return;
    }
    authenticate();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        SetLoading,
        authenticate,
        Logout,
        ChangePassword,
        Login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
