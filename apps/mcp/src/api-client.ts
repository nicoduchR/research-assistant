interface ApiClientConfig {
  baseUrl: string;
  apiKey: string;
}

interface ApiResponse<T> {
  ok: true;
  data: T;
}

interface ApiError {
  ok: false;
  error: string;
  status: number;
}

type ApiResult<T> = ApiResponse<T> | ApiError;

function getConfig(): ApiClientConfig {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API_BASE_URL environment variable is required');
  }
  const apiKey = process.env.MCP_API_KEY;
  if (!apiKey) {
    throw new Error('MCP_API_KEY environment variable is required');
  }
  return { baseUrl, apiKey };
}

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: body, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiPost<T>(path: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiPut<T>(path: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiPatch<T>(path: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiDelete<T>(path: string): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': apiKey,
      },
    });
    if (response.status === 204) {
      return { ok: true, data: null as T };
    }
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiUpload<T>(path: string, filePath: string): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  const fs = await import('node:fs');
  const nodePath = await import('node:path');

  if (!fs.existsSync(filePath)) {
    return { ok: false, error: `File not found: ${filePath}`, status: 0 };
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = nodePath.basename(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', blob, fileName);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export function toToolResult(result: ApiResult<unknown>): { content: Array<{ type: 'text'; text: string }>; isError?: boolean } {
  if (result.ok) {
    return {
      content: [{ type: 'text', text: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2) }],
    };
  }
  return {
    content: [{ type: 'text', text: `Error (${result.status}): ${result.error}` }],
    isError: true,
  };
}
