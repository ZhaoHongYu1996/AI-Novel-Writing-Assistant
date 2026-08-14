import { APP_VERSION } from "@/lib/constants";

export interface DesktopReleaseNotes {
  version: string;
  title: string;
  summary: string;
  items: string[];
}

export const CURRENT_DESKTOP_RELEASE_NOTES: DesktopReleaseNotes = {
  version: APP_VERSION,
  title: "本次更新介绍",
  summary: "这次更新让知识库资料更好导入和清理，角色立绘也可以看清细节。",
  items: [
    "知识库导入 txt 资料时不再限制文件大小。",
    "知识库资料可以彻底删除，暂时不用仍可先归档。",
    "角色库立绘支持放大查看，并可缩放核对细节。",
  ],
};
