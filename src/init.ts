#!/usr/bin/env node

import minimist from 'minimist';
import * as path from 'path';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { deleteCatalog } from '@/util/deleteCatalog';
import { downloadConfig } from '@/util/downloadConfig';
import { isFolderExist } from '@/util/isFolderExist';
import { redFile } from '@/util/readFile';
import { readPackageVersion } from '@/util/readVersionPackage';
import { updateJson } from '@/util/updateJson';

type PackageConfig = {
  instructions: string;
  default: string;
  extends: string;
  custom: string;
};

type Config = Record<
  string,
  {
    name: string;
    filePackage: PackageConfig;
    sequence: string[];
  }
>;

const config: Config = {
  'README.md': {
    name: 'README.md',
    filePackage: {
      instructions: 'README.md-instructions.md',
      default: 'README.md-default.md',
      extends: 'README.md-extends.md',
      custom: 'README.md-custom.md',
    },
    sequence: ['default', 'extends', 'custom'],
  },
};

export type availableTemplate = 'node' | string;

export type initConfig = {
  snpCatalog: string;
  template: availableTemplate | string;
  sUpdaterVersion: string;
  projectCatalog: string;
  temporaryFolder: string;
  snpConfigFile: string;
  remoteRepository: string;
  isDebug: boolean;
};

export type buildConfig = initConfig & {
  fileMap: { fileMap: string[]; files: Record<string, string[]> };
  templateVersion: string;
};

export const init = async (args: Args): Promise<initConfig> => {
  const argSnpCatalog: string = args.snpConfig || args._[0];
  const argTemplate: string = args.template || args._[1];
  const argProjectCatalog: string = args.project || args._[2];
  const argRemoteRepository: string = args.remoteRepository || args._[3];
  const isDebug: boolean = args.debug || false;
  debugFunction(isDebug, '=== Start SNP INIT ===');
  debugFunction(isDebug, { args });

  const version = await readPackageVersion('./package.json');
  const projectCatalog = argProjectCatalog ? path.join(argProjectCatalog) + path.sep : path.join('./');
  const snpCatalog = argSnpCatalog
    ? path.join(projectCatalog, argSnpCatalog) + path.sep
    : path.join(projectCatalog, '.snp') + path.sep;
  const template = argTemplate ? argTemplate : 'node';
  const temporaryFolder = path.join(snpCatalog, './temporary') + path.sep;
  const snpConfigFile = 'snp.config.json';
  const remoteRepository = argRemoteRepository
    ? argRemoteRepository
    : 'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/main/template/';

  return await createCatalog(temporaryFolder).then(() => {
    return {
      isDebug,
      projectCatalog,
      remoteRepository,
      sUpdaterVersion: version,
      snpCatalog,
      snpConfigFile,
      template,
      temporaryFolder,
    };
  });
};

export const createConfigFile = async (config: initConfig): Promise<initConfig> => {
  debugFunction(config.isDebug, { config });
  const { snpCatalog, template, sUpdaterVersion } = config;

  config.snpConfigFile = path.join(snpCatalog, 'snp.config.json');
  await isFolderExist({
    folderPath: snpCatalog,
    createFolder: true,
  });

  await createFile({
    filePath: config.snpConfigFile,
    content: JSON.stringify({ sUpdaterVersion, template }),
    isDebug: config.isDebug,
  });

  debugFunction(config.isDebug, { sUpdaterVersion, template }, 'created snp config file');

  return config;
};

export const downloadRemoteConfig = async (config: initConfig): Promise<buildConfig> => {
  const { fileMap, templateVersion } = await downloadConfig(config);

  debugFunction(config.isDebug, { fileMap, templateVersion }, 'download form remote repo');
  const organizeFileMap = (fileMap: string[]) => {
    const files = {};

    fileMap.forEach((file) => {
      const fileName = file.substring(0, file.lastIndexOf('-'));

      if (!files[fileName]) {
        files[fileName] = [];
      }
      files[fileName].push(`${config.snpCatalog}/${file}`);
    });

    return { fileMap, files };
  };
  return { ...config, templateVersion, fileMap: organizeFileMap(fileMap) };
};
export const buildConfig = async (config: buildConfig): Promise<buildConfig> => {
  const { fileMap, ...newConfigContent } = { ...config };
  await updateJson({ filePath: config.snpConfigFile, newContent: { ...newConfigContent } });
  const buildFile = async ({
    fileMap,
  }: {
    fileMap: {
      fileMap: string[];
      files: Record<string, string[]>;
    };
  }) => {
    const files = fileMap.files;
    const contentFile = Object.keys(files);

    for (const fileName of contentFile) {
      const defaultFile = files[fileName].find((element) => element.includes('-default.md')) || '';
      const contentFile = await redFile(defaultFile);
      await createFile({
        filePath: path.join(config.projectCatalog, fileName),
        content: contentFile,
        isDebug: config.isDebug,
      });
    }
  };
  await buildFile(config);
  return config;
};

export const cleanUp = async (config: buildConfig): Promise<any> => {
  debugFunction(config.isDebug, { config }, 'final config');
  await deleteCatalog(config.temporaryFolder, config.isDebug);

  debugFunction(config.isDebug, '=== final SNP INIT ===');
};

interface Args {
  snpConfig?: string;
  template?: string;
  project?: string;
  debug?: boolean;
  remoteRepository?: string;
  _: string[];
}

let args: Args = minimist(process.argv.slice(2));

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
}

init(args)
  .then((config) => createConfigFile(config))
  .then((config) => downloadRemoteConfig(config))
  .then((config) => buildConfig(config))
  .then((config) => cleanUp(config));
