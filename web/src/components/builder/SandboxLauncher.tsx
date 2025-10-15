"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DaytonaWorkspace = {
  id: string;
  devUrl: string;
  status: string;
  siteId?: string;
};

type LauncherToast = {
  id: number;
  tone: "success" | "error" | "info";
  message: string;
};

type SandboxLauncherProps = {
  siteId: string;
  repoUrl: string;
  /**
   * When true the component will attempt to automatically
   * launch a Daytona workspace for the provided inputs.
   */
  generationComplete: boolean;
};

async function parseJSON<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Received an unexpected response from the Daytona API.");
  }
}

async function createDaytonaWorkspace(siteId: string, repoUrl: string) {
  const response = await fetch("/api/daytona/workspaces", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ siteId, repoUrl }),
  });

  if (!response.ok) {
    const payload = await parseJSON<{ error?: string }>(response);
    throw new Error(payload.error ?? "Unable to create Daytona workspace.");
  }

  const payload = await parseJSON<{ workspace: DaytonaWorkspace }>(response);
  if (!payload.workspace) {
    throw new Error("The Daytona API did not return a workspace identifier.");
  }

  return payload.workspace;
}

async function fetchDaytonaWorkspace(workspaceId: string) {
  const response = await fetch(`/api/daytona/workspaces/${workspaceId}`);

  if (!response.ok) {
    const payload = await parseJSON<{ error?: string }>(response);
    throw new Error(payload.error ?? "Unable to load the Daytona workspace.");
  }

  const payload = await parseJSON<{ workspace: DaytonaWorkspace }>(response);
  if (!payload.workspace) {
    throw new Error("The Daytona API did not return workspace details.");
  }

  return payload.workspace;
}

async function stopDaytonaWorkspace(workspaceId: string) {
  const response = await fetch(`/api/daytona/workspaces/${workspaceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const payload = await parseJSON<{ error?: string }>(response);
    throw new Error(payload.error ?? "Unable to stop the Daytona workspace.");
  }
}

export default function SandboxLauncher({
  siteId,
  repoUrl,
  generationComplete,
}: SandboxLauncherProps) {
  const [workspace, setWorkspace] = useState<DaytonaWorkspace | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [toasts, setToasts] = useState<LauncherToast[]>([]);
  const lastLaunchKey = useRef<string | null>(null);

  useEffect(() => {
    if (!generationComplete || !siteId || !repoUrl) {
      return;
    }

    const launchKey = `${siteId}::${repoUrl}`;

    if (lastLaunchKey.current === launchKey || isLaunching || workspace) {
      return;
    }

    let cancelled = false;
    lastLaunchKey.current = launchKey;

    const launch = async () => {
      setIsLaunching(true);
      try {
        const createdWorkspace = await createDaytonaWorkspace(siteId, repoUrl);
        if (!cancelled) {
          setWorkspace(createdWorkspace);
          pushToast({
            tone: "success",
            message: "Daytona workspace is ready to open.",
          });
        }
      } catch (error) {
        if (!cancelled) {
          pushToast({
            tone: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to launch the Daytona workspace.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsLaunching(false);
        }
      }
    };

    launch();

    return () => {
      cancelled = true;
    };
    // We intentionally ignore workspace from dependencies so a manual reset can relaunch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generationComplete, siteId, repoUrl, isLaunching]);

  const pushToast = ({ tone, message }: Omit<LauncherToast, "id">) => {
    const toast: LauncherToast = {
      id: Date.now(),
      tone,
      message,
    };

    setToasts((existing) => [...existing, toast]);
    setTimeout(() => {
      setToasts((existing) => existing.filter((entry) => entry.id !== toast.id));
    }, 4000);
  };

  const resetLauncher = () => {
    setWorkspace(null);
    setIsLaunching(false);
    setIsRefreshing(false);
    setIsStopping(false);
    lastLaunchKey.current = null;
  };

  const handleRefresh = async () => {
    if (!workspace) {
      return;
    }
    setIsRefreshing(true);
    try {
      const updatedWorkspace = await fetchDaytonaWorkspace(workspace.id);
      setWorkspace(updatedWorkspace);
      pushToast({
        tone: "info",
        message: "Workspace details have been refreshed.",
      });
    } catch (error) {
      pushToast({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to refresh the Daytona workspace.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStop = async () => {
    if (!workspace) {
      return;
    }

    setIsStopping(true);
    try {
      await stopDaytonaWorkspace(workspace.id);
      setWorkspace((current) =>
        current
          ? {
              ...current,
              status: "stopped",
            }
          : current,
      );
      pushToast({
        tone: "success",
        message: "The Daytona workspace has been stopped.",
      });
    } catch (error) {
      pushToast({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to stop the Daytona workspace.",
      });
    } finally {
      setIsStopping(false);
    }
  };

  const handleRetry = () => {
    resetLauncher();
    if (generationComplete && siteId && repoUrl) {
      lastLaunchKey.current = null;
    }
  };

  const workspaceStatusLabel = useMemo(() => {
    if (isLaunching) {
      return "Launching Daytona sandbox...";
    }
    if (workspace?.status) {
      return `Workspace status: ${workspace.status}`;
    }
    if (generationComplete) {
      return "Awaiting Daytona workspace provisioning...";
    }
    return "Daytona workspace will launch once generation completes.";
  }, [generationComplete, isLaunching, workspace?.status]);

  const copyWorkspaceLink = async () => {
    if (!workspace?.devUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(workspace.devUrl);
      pushToast({ tone: "success", message: "Workspace link copied to clipboard." });
    } catch (error) {
      pushToast({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to copy the workspace link to the clipboard.",
      });
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-white">Daytona Sandbox</h3>
          <p className="text-sm text-slate-300">{workspaceStatusLabel}</p>
        </div>

        {isLaunching && (
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-r-transparent"></span>
            Provisioning workspace for {siteId}...
          </div>
        )}

        {workspace?.devUrl && (
          <div className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Workspace URL</p>
              <p className="truncate text-sm text-slate-300" title={workspace.devUrl}>
                {workspace.devUrl}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={workspace.devUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Open in Daytona
              </a>
              <button
                type="button"
                onClick={copyWorkspaceLink}
                className="inline-flex items-center justify-center rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Copy link
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRefreshing ? "Refreshing..." : "Refresh status"}
              </button>
              <button
                type="button"
                onClick={handleStop}
                disabled={isStopping}
                className="inline-flex items-center justify-center rounded-md border border-red-500/40 px-3 py-2 text-sm font-medium text-red-300 transition hover:border-red-400 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStopping ? "Stopping..." : "Stop workspace"}
              </button>
            </div>
          </div>
        )}

        {!workspace && !isLaunching && generationComplete && (
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
            <span>Workspace provisioning is queued. You can retry if it stalls.</span>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {toasts.length > 0 && (
        <div className="mt-4 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`rounded-md border px-3 py-2 text-sm ${
                toast.tone === "error"
                  ? "border-red-500/40 bg-red-950/40 text-red-200"
                  : toast.tone === "success"
                    ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                    : "border-sky-500/40 bg-sky-950/40 text-sky-200"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
