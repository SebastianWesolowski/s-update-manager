import { AvailableSUMKeySuffixTypes, AvailableSUMSuffixTypes } from '@/feature/config/types';

export const formatSum = (
  input: string,
  returnValue: 'key' | 'suffix'
): AvailableSUMKeySuffixTypes | AvailableSUMSuffixTypes | null => {
  const suffixMapping: { [key in AvailableSUMSuffixTypes]: AvailableSUMKeySuffixTypes } = {
    '-custom.md': 'customFile',
    '-extend.md': 'extendFile',
    '-default.md': 'defaultFile',
  };

  const reverseSuffixMapping: { [key in AvailableSUMKeySuffixTypes]: AvailableSUMSuffixTypes } = {
    customFile: '-custom.md',
    extendFile: '-extend.md',
    defaultFile: '-default.md',
  };

  if (returnValue === 'key') {
    // Sprawdź, czy input kończy się jednym z sufiksów
    for (const suffix in suffixMapping) {
      if (input.endsWith(suffix)) {
        return suffixMapping[suffix as AvailableSUMKeySuffixTypes];
      }
    }
  } else {
    // Sprawdź, czy input jest jednym z kluczy w odwrotnej mapie
    return reverseSuffixMapping[input as AvailableSUMSuffixTypes] || null;
  }

  // Gdy nie pasuje żaden z podanych kluczy ani sufiksów
  return null;
};
