/**
 * CustomError is a custom error class that extends the built-in Error class, 
 * ensuring that the user receives a helpful error message that does
 * not expose sensitive information.
 * 
 * It also adds a status property for HTTP status codes.
 *
 * @class
 * @extends {Error}
 */
class CustomError extends Error {
  status: number;

  /**
   * Creates a new CustomError instance.
   *
   * @param {Object} param0 - An object.
   * @param {string} param0.message - The error message.
   * @param {number} param0.status - The HTTP status code associated with the error.
   */
  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
  }
}

export default CustomError;