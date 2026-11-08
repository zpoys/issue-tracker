export type SuccessStatusCode = 200 | 201 | 202;
export type ErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 502 | 503 | 504;

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: object;
};

export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export const httpResponse = {
  success<T>(data: T, message: string, meta?: object) {
    return {
      success: true as const,
      message: message,
      data,
      ...(meta !== undefined && { meta }),
    };
  },

  error(code: string, message: string) {
    return {
      success: false as const,
      error: {
        code,
        message,
      },
    };
  },
} as const;
