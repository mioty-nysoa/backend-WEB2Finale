export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    
    // Conserve le nom de la classe d'erreur
    this.name = "ApiError"; 

    // Capture la stack trace exacte du fichier et de la ligne où l'erreur est levée
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}