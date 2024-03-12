async function handleHttpErrors({ response, data }) {
  if (response.ok) return [];

  let responseData;
  if (response.body) {
    responseData = await response.json();
  }

  if (responseData && Array.isArray(responseData)) {
    return responseData.map((error) => {
      const { message, ...rest } = error;
      return { msg: message, ...rest };
    });
  }

  let msg;
  if (data.message) {
    msg = data.message;
  } else {
    switch (response.status) {
      case 400:
        msg = "Bad Request. Please check your form inputs and try again.";
        break;
      case 401:
        msg = "Incorrect email or password. Please try again.";
        break;
      case 403:
        msg = "You do not have permission to access this resource.";
        break;
      case 404:
        msg = "Resource not found.";
        break;
      case 409:
        msg =
          "A user with this email already exists. Please try again with a different email or reset your password.";
        break;
      case 500:
        msg = "Internal Server Error";
        break;
      default:
        msg = "Unknown Error";
        break;
    }
  }

  return [{ field: "general", msg }];
}

export default handleHttpErrors;