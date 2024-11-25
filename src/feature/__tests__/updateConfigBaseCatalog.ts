import { ConfigType } from '../config/types';

/**
 * Updates the configuration paths based on the provided catalog path. Modifies paths for sum catalog,
 * file map config, project catalog, temporary folder and sum config file.
 * @param config - The original configuration object
 * @param catalogPath - Base path to update the configuration paths
 * @returns Updated configuration object with modified paths
 */
export const updateConfigBaseCatalog = (config: ConfigType, catalogPath: string): ConfigType => {
  return {
    ...config,
    sumCatalog: `${catalogPath}.sum/`,
    sumFileMapConfig: `${catalogPath}.sum/repositoryMap.json`,
    projectCatalog: `${catalogPath}`,
    temporaryFolder: `${catalogPath}.sum/temporary/`,
    sumConfigFilePath: `${catalogPath}.sum.config.json`,
  };
};
