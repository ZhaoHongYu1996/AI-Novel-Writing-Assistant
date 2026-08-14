import { useEffect, useState, type ReactNode } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src?: string;
  alt: string;
  title: string;
  caption?: ReactNode;
  actions?: ReactNode;
}

function clampScale(value: number): number {
  const rounded = Math.round(value * 10) / 10;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, rounded));
}

export function ImageLightbox({
  open,
  onOpenChange,
  src,
  alt,
  title,
  caption,
  actions,
}: ImageLightboxProps) {
  const [scale, setScale] = useState(MIN_SCALE);

  useEffect(() => {
    setScale(MIN_SCALE);
  }, [open, src]);

  const zoomOut = () => setScale((current) => clampScale(current - SCALE_STEP));
  const zoomIn = () => setScale((current) => clampScale(current + SCALE_STEP));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[min(96dvh,1100px)] w-[min(96vw,1280px)] max-w-none flex-col gap-0 overflow-hidden border-border/40 bg-zinc-950 p-0 text-zinc-50"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-3 pr-12">
          <div className="min-w-0">
            <DialogTitle className="truncate text-base font-semibold">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              图片已放大。可以使用放大、缩小或滚轮查看细节，也可以关闭返回列表。
            </DialogDescription>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
            >
              <ZoomOut className="h-4 w-4" />
              缩小
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
            >
              <ZoomIn className="h-4 w-4" />
              放大
            </Button>
            {scale > MIN_SCALE ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-full text-zinc-200 hover:bg-white/10 hover:text-white"
                onClick={() => setScale(MIN_SCALE)}
              >
                适合窗口
              </Button>
            ) : null}
          </div>
        </div>
        <div
          className="min-h-0 flex-1 overflow-auto bg-black"
          onWheel={(event) => {
            if (event.deltaY < 0) {
              zoomIn();
              return;
            }
            zoomOut();
          }}
        >
          {src ? (
            <div
              className={cn(
                "flex min-h-full min-w-full p-4",
                scale > MIN_SCALE ? "items-start justify-start" : "items-center justify-center",
              )}
            >
              <img
                src={src}
                alt={alt}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain"
                style={scale > MIN_SCALE ? {
                  maxHeight: "none",
                  maxWidth: "none",
                  width: `${scale * 100}%`,
                  height: "auto",
                } : undefined}
              />
            </div>
          ) : null}
        </div>
        {caption || actions ? (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3">
            <div className="min-w-0 text-xs text-zinc-400">{caption}</div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
