export interface Args {
  snpConfig?: string;
  template?: string;
  project?: string;
  debug?: boolean;
  remoteRepository?: string;
  _: string[];
}

export const setArgs = (args: Args): Args => {
  const argSnpCatalog: string = args.snpConfig || args._[0];
  const argTemplate: string = args.template || args._[1];
  const argProjectCatalog: string = args.project || args._[2];
  const argRemoteRepository: string = args.remoteRepository || args._[3];
  const isDebug: boolean = args.debug || false;

  if (process.env.SDEBUG === 'true') {
    args = {
      _: [],
      snpConfig: './.snp',
      template: 'node',
      project: './test/fakeProjectRootfolder',
      remoteRepository: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/',
      debug: true,
    };
    console.log({ args });
    return args;
  }

  return {
    snpConfig: argSnpCatalog,
    template: argTemplate,
    project: argProjectCatalog,
    remoteRepository: argRemoteRepository,
    debug: isDebug,
    _: args._,
  };
};
