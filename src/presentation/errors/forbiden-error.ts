export class ForbidenError extends Error {
  constructor() {
    super("Credentials provided already in use");
    this.name = "ForbidenError";
  }
}
