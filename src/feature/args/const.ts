import { Args } from '@/feature/args/args';
import { ArgsTemplate } from '@/feature/args/argsTemplate';

export const defaultArgs: Args = {
  _: [],
  isDebug: 'true',
  projectCatalog: './mock/mockProject',
  remoteRepository:
    'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalog/repositoryMap.json/',
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
