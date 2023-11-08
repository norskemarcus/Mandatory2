import dotenv from 'dotenv';
dotenv.config();

export default {
  type: 'service_account',
  project_id: 'mandatory2-68b5c',
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY_ADMIN,
  client_email: 'firebase-adminsdk-lhnln@mandatory2-68b5c.iam.gserviceaccount.com',
  client_id: '110885303948243168638',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lhnln%40mandatory2-68b5c.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
