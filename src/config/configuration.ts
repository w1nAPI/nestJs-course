export default () => ({
  jwt: {
    user: {
      secret: process.env.USER_JWT_SECRET,
      expiresIn: process.env.USER_JWT_EXPIRES_IN,
      hashSecret: process.env.USER_HASH_SECRET,
    },
    admin: {
      secret: process.env.ADMIN_JWT_SECRET,
      expiresIn: process.env.ADMIN_JWT_EXPIRES_IN,
      hashSecret: process.env.ADMIN_HASH_SECRET,
    },
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    publicUrl: process.env.MINIO_PUBLIC_URL,
  },
});
