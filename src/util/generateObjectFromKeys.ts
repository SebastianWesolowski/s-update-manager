export const generateObjectFromKeys = <T = Record<string, any>>(keysArray: string[]): T => {
  const result: any = {};

  // Przejdź przez każdy element tablicy i dodaj go jako klucz do obiektu
  keysArray.forEach((key) => {
    result[key] = {}; // Możesz zmodyfikować przypisanie wartości według potrzeb
  });

  return result as T;
};
