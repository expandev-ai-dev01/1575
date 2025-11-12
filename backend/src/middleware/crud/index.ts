import { Request } from 'express';
import { z } from 'zod';

export interface SecurityCheck {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

export class CrudController {
  private securityChecks: SecurityCheck[];

  constructor(securityChecks: SecurityCheck[]) {
    this.securityChecks = securityChecks;
  }

  async create(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | undefined, any]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  async read(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | undefined, any]> {
    return this.validateRequest(req, schema, 'READ');
  }

  async update(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | undefined, any]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  async delete(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | undefined, any]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  private async validateRequest(
    req: Request,
    schema: z.ZodSchema,
    permission: string
  ): Promise<[ValidatedRequest | undefined, any]> {
    try {
      const params = {
        ...req.params,
        ...req.query,
        ...req.body,
      };

      const validated = await schema.parseAsync(params);

      const credential = {
        idAccount: 1,
        idUser: 1,
      };

      return [
        {
          credential,
          params: validated,
        },
        undefined,
      ];
    } catch (error: any) {
      return [
        undefined,
        {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: error.errors || error.message,
        },
      ];
    }
  }
}

export function successResponse(data: any, metadata?: any) {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

export function errorResponse(message: string, code?: string, details?: any) {
  return {
    success: false,
    error: {
      code: code || 'ERROR',
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

export const StatusGeneralError = {
  statusCode: 500,
  code: 'INTERNAL_SERVER_ERROR',
  message: 'An unexpected error occurred',
};
