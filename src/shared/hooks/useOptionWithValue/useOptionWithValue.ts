import { useState } from "react";
import { OptionWithValue } from "shared/components";

export interface IArgs<T> {
  isEqual: (a: T, b: T) => boolean;
  toOption: (a: T) => OptionWithValue<T>;
}

export interface IState<T> {
  getOption: (obj: T) => OptionWithValue<T>;
}

export const useOptioWithValue = <T>({
  isEqual,
  toOption,
}: IArgs<T>): IState<T> => {
  const [cache, setCache] = useState(new Map<T, OptionWithValue<T>>());

  const getOption = (obj: T) => {
    const cacheKey = Array.from(cache.keys()).find((f) => isEqual(f, obj));

    let cacheValue: OptionWithValue<T>;
    if (cacheKey) {
      cacheValue = cache.get(cacheKey)!;
    } else {
      cacheValue = toOption(obj);
      setCache((value) => new Map(value).set(obj, cacheValue));
    }

    return cacheValue;
  };

  return {
    getOption,
  };
};

export default useOptioWithValue;
