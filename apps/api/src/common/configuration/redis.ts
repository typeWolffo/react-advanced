import { registerAs } from "@nestjs/config";
import { type Static, Type } from "@sinclair/typebox";
import { configValidator } from "src/utils/configValidator";


const schema = Type.Object({
  REDIS_URL: Type.String(),
  REDIS_STREAM_NAME: Type.Optional(Type.String()),
  REDIS_STREAM_MAX_LEN: Type.Optional(Type.Number()),
  REDIS_SESSION_KEY_PREFIX: Type.Optional(Type.String()),
});

type RedisConfigSchema = Static<typeof schema>;

const validateRedisConfig = configValidator(schema);

export default registerAs("redis", (): RedisConfigSchema => {
  const values = {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_STREAM_NAME: process.env.REDIS_STREAM_NAME,
    REDIS_STREAM_MAX_LEN: process.env.REDIS_STREAM_MAX_LEN,
    REDIS_SESSION_KEY_PREFIX: process.env.REDIS_SESSION_KEY_PREFIX,
  };

  return validateRedisConfig(values);
});
