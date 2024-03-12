async function fetchWithRetry({
  url,
  options,
  retryCount = 3,
  handleHttpErrors,
  setErrors,
  delay = 2000,
}) {
  let response;
  try {
    response = await fetch(url, options);
    let data = response;
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
    });
  }
}

export default fetchWithRetry;