import httpErrorHandler from "@/utils/handleHttpErrors";

interface FetchWithRetryProps {
  url: string;
  options: Object;
  retryCount: number | undefined;
  handleHttpErrors: Function;
  setErrors: Function | undefined;
  delay: number | undefined;
}

interface FetchData extends Partial<Response> {
  ok?: boolean;
}

async function fetchWithRetry({
  url,
  options,
  retryCount = 3,
  handleHttpErrors = httpErrorHandler,
  setErrors,
  delay = 2000,
}: FetchWithRetryProps) {
  let response;
  try {
    let data: FetchData;
    response = await fetch(url, options);
    data = response;
    let errors;
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
    } else {
      errors = await handleHttpErrors({ response, data });
      if (errors) {
        setErrors(errors);
      } else {
        data = {
          ok: false,
        };
      }
      return data;
    }
    setErrors([]);
    data = {
      ok: true,
      ...data,
    };
    return data;
  } catch (error) {
    if (
      retryCount === 1 ||
      (response && response.status === 401) ||
      (response && response.status === 403) ||
      (response && response.status === 400) ||
      (response && response.status === 409) ||
      (response && response.status === 404) ||
      (response && response.status === 410)
    ) {
      return Promise.reject(error);
    }
    await new Promise((r) => {
      setTimeout(r, delay);
    });
    return fetchWithRetry({
      url,
      options,
      retryCount: retryCount - 1,
      handleHttpErrors,
      setErrors,
      delay,
    });
  }
}

export default fetchWithRetry;
