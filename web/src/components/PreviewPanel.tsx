"use client";

import { useEffect, useRef } from "react";

interface PreviewPanelProps {
  previewUrl?: string;
  htmlContent?: string;
  isLoading?: boolean;
}

export function PreviewPanel({ previewUrl, htmlContent, isLoading }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Preview</h2>
            <p className="text-sm text-muted-foreground">Live preview of your site</p>
          </div>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Open in new tab →
            </a>
          )}
        </div>
      </div>

      <div className="flex-1 relative bg-gray-100 dark:bg-gray-900">
        {isLoading && !previewUrl && !htmlContent ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generating your site...</p>
            </div>
          </div>
        ) : previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            title="Site Preview"
          />
        ) : htmlContent ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Site Preview"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

