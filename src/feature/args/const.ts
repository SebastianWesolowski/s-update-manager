import { Args } from '@/feature/args/args';
import { ArgsTemplate } from '@/feature/args/argsTemplate';

export const defaultArgs: Args = {
  _: [],
  isDebug: 'true',
  projectCatalog: './mock/mockProject',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
  snpCatalog: './mock/mockProject/.snp',
};

export const defaultTemplateArgs: ArgsTemplate = {
  _: [],
  isDebug: 'true',
  projectCatalog: './mock/mockTemplate',
};
export const defaultTemplateArgsRebuild: ArgsTemplate = {
  _: [],
  isDebug: 'true',
  projectCatalog: './mock/mockTemplateToUpdate',
};
