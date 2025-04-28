import { JwtPayloadDto } from '../../auth/dto/jwt-payload.dto'; // Adjust the import path as needed

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      // Add the user property with the correct type
      user?: JwtPayloadDto; // Use '?' if it might be optional, or remove '?' if always present after guard
    }
  }
}
