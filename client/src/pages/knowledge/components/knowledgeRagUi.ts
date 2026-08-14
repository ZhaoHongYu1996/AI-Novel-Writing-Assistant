import type { RagJobSummary } from "@/api/knowledge";

export function buildKnowledgeDocumentDeleteConfirmMessage(document: {
  title: string;
  status?: string;
  bookAnalysisCount?: number;
}): string {
  const lines = [`确认删除“${document.title}”吗？删除后原文、版本和检索索引都会去掉，无法恢复。`];
  if ((document.bookAnalysisCount ?? 0) > 0) {
    lines.push(`这份资料还关联了 ${document.bookAnalysisCount} 个拆书项目，删除后这些拆书结果也会一起去掉。`);
  }
  if (document.status !== "archived") {
    lines.push("如果只是暂时不用，可以先归档，之后还能恢复。");
  }
  return lines.join("\n");
}

export function formatStatus(status: string): string {
  switch (status) {
    case "enabled":
      return "已启用";
    case "disabled":
      return "已停用";
    case "archived":
      return "已归档";
    case "idle":
      return "空闲";
    case "queued":
      return "排队中";
    case "running":
      return "执行中";
    case "succeeded":
      return "成功";
    case "failed":
      return "失败";
    default:
      return status;
  }
}

export function getRagJobProgressPercent(job: RagJobSummary): number {
  const raw = job.progress?.percent ?? (job.status === "succeeded" ? 1 : 0);
  return Math.max(0, Math.min(100, Math.round(raw * 100)));
}

export function getRagJobProgressWidth(job: RagJobSummary): string {
  const percent = getRagJobProgressPercent(job);
  if (job.status === "queued" || job.status === "running") {
    return `${Math.max(percent, 6)}%`;
  }
  return `${percent}%`;
}

export function formatRagJobMeta(job: RagJobSummary): string {
  const parts = [job.jobType, `尝试 ${job.attempts}/${job.maxAttempts}`];
  if (job.progress?.current !== undefined && job.progress?.total !== undefined && job.progress.total > 0) {
    parts.push(`${job.progress.current}/${job.progress.total}`);
  }
  if (job.progress?.chunks) {
    parts.push(`${job.progress.chunks} 分块`);
  }
  if (job.progress?.documents) {
    parts.push(`${job.progress.documents} 文档`);
  }
  return parts.join(" | ");
}
