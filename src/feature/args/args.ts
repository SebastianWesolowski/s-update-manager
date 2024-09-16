import { defaultArgs } from '@/feature/args/const';

export interface Args {
  snpCatalog?: string;
  projectCatalog?: string;
  snpConfigFileName?: string;
  snpConfigFile?: string;
  remoteRepository?: string;
  isDebug?: string;
  _: string[];
}
export interface ProcessedArgs {
  snpCatalog?: string;
  projectCatalog?: string;
  snpConfigFileName?: string;
  snpConfigFile?: string;
  remoteRepository?: string;
  isDebug?: boolean;
  _: string[];
}

export const setArgs = (args: Args): ProcessedArgs => {
  // TODO: Prepare separate data for different scripts using process.env.STYPE
  // This should handle different argument sets for init, update, build, and template scripts
  if (process.env.SDEBUG === 'true') {
    args = defaultArgs;
    console.log({ setArgs: args });
  }

  const argSnpCatalog: string | undefined = args.snpCatalog || args._[0];
  const argProjectCatalog = args.projectCatalog || args._[2];
  const argSnpConfigFileName = args.snpConfigFileName || args._[3];
  const argSnpConfigFile = args.snpConfigFile || args._[4];
  const argRemoteRepository = args.remoteRepository || args._[5];
  const argIsDebug: string = args.isDebug || args._[6];

  return {
    snpCatalog: argSnpCatalog ? String(argSnpCatalog) : undefined,
    projectCatalog: argProjectCatalog ? String(argProjectCatalog) : undefined,
    snpConfigFileName: argSnpConfigFileName ? String(argSnpConfigFileName) : undefined,
    snpConfigFile: argSnpConfigFile ? String(argSnpConfigFile) : undefined,
    remoteRepository: argRemoteRepository ? String(argRemoteRepository) : undefined,
    isDebug: argIsDebug ? Boolean(argIsDebug) : undefined,
    _: args._,
  };
};
