import path from 'path';
import { Args, setArgs } from '@/feature/args';
import { debugFunction } from '@/util/debugFunction';
import { redFile } from '@/util/readFile';
import { readPackageVersion } from '@/util/readVersionPackage';

export type availableTemplate = 'node' | string;

export type defaultConfigType = {
  snpCatalog: string;
  template: availableTemplate | string;
  sUpdaterVersion: string;
  projectCatalog: string;
  temporaryFolder: string;
  snpConfigFileName: string;
  snpConfigFile: string;
  remoteRepository: string;
  isDebug: boolean;
};

export const defaultConfig = async (args: Args): Promise<defaultConfigType> => {
  const argsObject = setArgs(args);
  const projectCatalog = argsObject.project ? path.join(argsObject.project) + path.sep : path.join('./');
  const snpCatalog = argsObject.snpConfig
    ? path.join(projectCatalog, argsObject.snpConfig) + path.sep
    : path.join(projectCatalog, '.snp') + path.sep;
  const snpConfigFileName = 'snp.config.json';
  const snpConfigFile = path.join(snpCatalog, snpConfigFileName);

  const snpLocalConfigData: defaultConfigType = JSON.parse(await redFile(path.join(snpConfigFile)));

  if (snpLocalConfigData) {
    console.log(`use config from local config file ${snpConfigFile}`);
    debugFunction(argsObject.debug || false, snpLocalConfigData, 'local config file');
    return snpLocalConfigData;
  }

  const isDebug = argsObject.debug || false;
  const version = await readPackageVersion('./package.json');
  const template = argsObject.template ? argsObject.template : 'node';
  const temporaryFolder = path.join(snpCatalog, './temporary') + path.sep;

  const remoteRepository = argsObject.remoteRepository
    ? argsObject.remoteRepository
    : 'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/main/template/';

  return {
    isDebug,
    projectCatalog,
    remoteRepository,
    sUpdaterVersion: version,
    snpCatalog,
    snpConfigFileName,
    snpConfigFile,
    template,
    temporaryFolder,
  };
};
