//constant.js
export const ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    STAGING: 'staging',
    LOCAL: 'local',
    SANDBOX: 'sandbox',
  };

  export const HTTP_STATUS = {
    OK: 200,
    SUCCESS: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  };
  
  export const RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
  };

  export const CONFIG = {
    MASTER_DB_URL: 'MASTER_DB_URL',
    DB_NAME: 'DB_NAME',
    JWT_SECRET: 'JWT_SECRET',
    JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
    TWILIO_ACCOUNT_SID: 'TWILIO_ACCOUNT_SID',
    TWILIO_AUTH_TOKEN: 'TWILIO_AUTH_TOKEN',
    TWILIO_PHONE_NUMBER: 'TWILIO_PHONE_NUMBER',
    AWS_BUCKET_NAME: 'AWS_BUCKET_NAME',
    AWS_ACCESS_KEY: 'AWS_ACCESS_KEY',
    AWS_ACCESS_SECRET: 'AWS_ACCESS_SECRET',
    AWS_BUCKET_REGION: 'AWS_BUCKET_REGION',
    S3_BASE_URL: 'S3_BASE_URL',
    NODE_ENV: 'NODE_ENV',
  }; 
  

  
  export const ROLE_TYPE= {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    DOCTOR: 3,
    STAFF: 4,
    PATIENT: 5,

  }
  
  export const DEVICE_TYPE = {
    ANDROID: 1,
    IOS: 2,
    WEB: 3,
  }