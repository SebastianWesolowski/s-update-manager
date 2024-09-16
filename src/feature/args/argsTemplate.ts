import { defaultTemplateArgs } from '@/feature/args/const';

export interface ArgsTemplate {
  projectCatalog?: string;
  isDebug?: string;
  _: string[];
}

export interface ProcessedArgsTemplate {
  projectCatalog?: string;
  isDebug?: boolean;
  _: string[];
}

export const setArgsTemplate = (args: ArgsTemplate): ProcessedArgsTemplate => {
  if (process.env.SDEBUG === 'true') {
    args = defaultTemplateArgs;
    console.log({ setArgsTemplate: args });
  }

  const argProjectCatalog = args.projectCatalog || args._[0];
  const argIsDebug: string = args.isDebug || args._[1];

  return {
    projectCatalog: argProjectCatalog ? String(argProjectCatalog) : undefined,
    isDebug: argIsDebug ? Boolean(argIsDebug) : undefined,
    _: args._,
  };
};
