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

export const setArgs = (args: Args): Args => {
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
    snpCatalog: argSnpCatalog,
    projectCatalog: argProjectCatalog,
    snpConfigFileName: argSnpConfigFileName,
    snpConfigFile: argSnpConfigFile,
    remoteRepository: argRemoteRepository,
    isDebug: argIsDebug,
    _: args._,
  };
};
