import { AvailableSNPKeySuffixTypes, AvailableSNPSuffixTypes } from '@/feature/config/types';

export const formatSnp = (
  input: string,
  returnValue: 'key' | 'suffix'
): AvailableSNPKeySuffixTypes | AvailableSNPSuffixTypes | null => {
  const suffixMapping: { [key in AvailableSNPSuffixTypes]: AvailableSNPKeySuffixTypes } = {
    '-custom.md': 'customFile',
    '-extend.md': 'extendFile',
    '-default.md': 'defaultFile',
  };

  const reverseSuffixMapping: { [key in AvailableSNPKeySuffixTypes]: AvailableSNPSuffixTypes } = {
    customFile: '-custom.md',
    extendFile: '-extend.md',
    defaultFile: '-default.md',
  };

  if (returnValue === 'key') {
    // Sprawdź, czy input kończy się jednym z sufiksów
    for (const suffix in suffixMapping) {
      if (input.endsWith(suffix)) {
        return suffixMapping[suffix as AvailableSNPKeySuffixTypes];
      }
    }
  } else {
    // Sprawdź, czy input jest jednym z kluczy w odwrotnej mapie
    return reverseSuffixMapping[input as AvailableSNPSuffixTypes] || null;
  }

  // Gdy nie pasuje żaden z podanych kluczy ani sufiksów
  return null;
};
