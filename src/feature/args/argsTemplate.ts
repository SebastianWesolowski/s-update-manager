export interface ArgsTemplate {
  projectCatalog?: string;
  isDebug?: string;
  _: string[];
}

export const setArgsTemplate = (args: ArgsTemplate): ArgsTemplate => {
  if (process.env.SDEBUG === 'true') {
    args = {
      _: [],
      isDebug: 'true',
      projectCatalog: './template/node/',
    };
    console.log({ setArgsTemplate: args });
  }

  const argProjectCatalog = args.projectCatalog || args._[0];
  const argIsDebug: string = args.isDebug || args._[1];

  return {
    projectCatalog: argProjectCatalog,
    isDebug: argIsDebug,
    _: args._,
  };
};
