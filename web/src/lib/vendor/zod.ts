export type ZodType<T = unknown> = {
  optional(): ZodType<T | undefined>;
};

type Shape = Record<string, ZodType<unknown>>;

type ArrayType<T> = ZodType<T[]>;

type RecordType = ZodType<Record<string, unknown>>;

type EnumType<T extends readonly [string, ...string[]]> = ZodType<T[number]>;

function makeType<T>(): ZodType<T> {
  return {
    optional() {
      return makeType<T | undefined>();
    },
  };
}

export const z = {
  string: (): ZodType<string> => makeType<string>(),
  boolean: (): ZodType<boolean> => makeType<boolean>(),
  any: (): ZodType<unknown> => makeType<unknown>(),
  object: (shape: Shape): ZodType<Record<string, unknown>> => {
    void shape;
    return makeType<Record<string, unknown>>();
  },
  record: (arg: ZodType<unknown> | Record<string, unknown>): RecordType => {
    void arg;
    return makeType<Record<string, unknown>>();
  },
  array: <T>(schema: ZodType<T>): ArrayType<T> => {
    void schema;
    return makeType<T[]>();
  },
  enum: <T extends readonly [string, ...string[]]>(values: T): EnumType<T> => {
    void values;
    return makeType<T[number]>();
  },
};
