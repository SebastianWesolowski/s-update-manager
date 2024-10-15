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
    // Check if the input ends with one of the suffixes
    for (const suffix in suffixMapping) {
      if (input.endsWith(suffix)) {
        return suffixMapping[suffix as AvailableSUMKeySuffixTypes];
      }
    }
  } else {
    // Check if the input is one of the keys in the reverse map
    return reverseSuffixMapping[input as AvailableSUMSuffixTypes] || null;
  }

  // When none of the given keys or suffixes match
  return null;
};
