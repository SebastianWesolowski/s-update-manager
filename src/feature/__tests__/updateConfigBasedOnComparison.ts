// configUtils.ts

type ConfigType<T> = {
  [K in keyof T]?: T[K];
};

/**
 * Updates the target configuration object based on a comparison of values between two other configuration objects,
 * and returns the updated configuration object.
 *
 * This function iterates over a specified set of keys and checks if the corresponding values in the two input objects
 * (a and b) are equal. If the values for a given key are equal, the function assigns the value from the first object (a)
 * to the target object. The updated configuration object is then returned.
 *
 * @param target - The initial configuration object that will be updated.
 * @param a - The first configuration object used for comparison and potential value assignment.
 * @param b - The second configuration object used for comparison.
 * @param keysToCompare - An array of keys that specify which properties should be compared and potentially updated.
 * @returns The updated configuration object.
 */
export function updateConfigBasedOnComparison<T>(
  target: ConfigType<T>,
  a: ConfigType<T>,
  b: ConfigType<T>,
  keysToCompare: (keyof T)[]
): ConfigType<T> {
  const updatedConfig = { ...target }; // Tworzenie kopii obiektu target

  keysToCompare.forEach((key) => {
    if (a[key] === b[key]) {
      updatedConfig[key] = a[key];
    }
  });

  return updatedConfig; // Zwracanie zaktualizowanego obiektu
}
