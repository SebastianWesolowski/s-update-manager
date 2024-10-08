import { defaultArgs } from '@/feature/args/const';

export interface Args {
  sumCatalog?: string;
  projectCatalog?: string;
  sumConfigFileName?: string;
  sumConfigFile?: string;
  remoteRepository?: string;
  isDebug?: string;
  _: string[];
}
export interface ProcessedArgs {
  sumCatalog?: string;
  projectCatalog?: string;
  sumConfigFileName?: string;
  sumConfigFile?: string;
  remoteRepository?: string;
  isDebug?: boolean;
  _: string[];
}

export const setArgs = (args: Args): ProcessedArgs => {
  // TODO: Prepare separate data for different scripts using process.env.STYPE
  // This should handle different argument sets for init, update, build, and template scripts
  if (process.env.SDEBUG === 'true') {
    args = defaultArgs;

    if (process.env.STYPE === 'update') {
      args = {
        ...args,
        projectCatalog: './mock/mockProjectToUpdated',
        sumCatalog: './mock/mockProjectToUpdated/.sum',
      };
    }
    if (process.env.STYPE === 'build') {
      args = {
        ...args,
        projectCatalog: './mock/mockProjectToBuild',
        sumCatalog: './mock/mockProjectToBuild/.sum',
      };
    }
    console.log({ setArgs: args });
  }

  const argSumCatalog: string | undefined = args.sumCatalog || args._[0];
  const argProjectCatalog = args.projectCatalog || args._[2];
  const argSumConfigFileName = args.sumConfigFileName || args._[3];
  const argSumConfigFile = args.sumConfigFile || args._[4];
  const argRemoteRepository = args.remoteRepository || args._[5];
  const argIsDebug: string = args.isDebug || args._[6];

  return {
    sumCatalog: argSumCatalog ? String(argSumCatalog) : undefined,
    projectCatalog: argProjectCatalog ? String(argProjectCatalog) : undefined,
    sumConfigFileName: argSumConfigFileName ? String(argSumConfigFileName) : undefined,
    sumConfigFile: argSumConfigFile ? String(argSumConfigFile) : undefined,
    remoteRepository: argRemoteRepository ? String(argRemoteRepository) : undefined,
    isDebug: argIsDebug ? Boolean(argIsDebug) : undefined,
    _: args._,
  };
};
