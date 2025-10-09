export async function createDaytonaWorkspace<T = unknown>(payload: Record<string, unknown>) {
  const response = await fetch("/api/daytona/workspaces", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export async function openDaytonaPR<T = unknown>(id: string, payload: Record<string, unknown>) {
  const response = await fetch(`/api/daytona/workspaces/${id}/pr`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}
