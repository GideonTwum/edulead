import type { ThemeConfig } from "antd";

export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: "#151a63",
    colorSuccess: "#b5d334",
    colorInfo: "#151a63",
    colorLink: "#151a63",
    colorLinkHover: "#0d123f",
    borderRadius: 8,
    fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f7f8fa",
  },
  components: {
    Layout: {
      siderBg: "#151a63",
      triggerBg: "#0d123f",
      bodyBg: "#f7f8fa",
    },
    Menu: {
      darkItemBg: "#151a63",
      darkSubMenuItemBg: "#0d123f",
      darkItemSelectedBg: "#b5d334",
      darkItemSelectedColor: "#151a63",
      darkItemHoverBg: "rgba(181, 211, 52, 0.15)",
    },
    Button: {
      primaryShadow: "none",
    },
    Table: {
      headerBg: "#f7f8fa",
    },
  },
};
