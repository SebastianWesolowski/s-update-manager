import { ConfigType } from '@/feature/defaultConfig';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJson } from '@/util/updateJson';

export interface snpArrayPathFileSet {
  defaultFile: string;
  instructionsFile?: string;
  customFile?: string;
  extendFile?: string;
  createdProjectFile?: string;
}

export interface FileMapConfig {
  updatedContent: any;
  templateVersion: string;
  fileMap: string[];
  snpFileMap?: Record<string, snpArrayPathFileSet>;
}

export const updateFileMapConfig = async (config: ConfigType, newContent: object): Promise<FileMapConfig | null> => {
  if (await isFileExists(config.snpFileMapConfig)) {
    return await updateJson({ filePath: config.snpFileMapConfig, newContent }).then(
      await readFile(config.snpFileMapConfig).then(async (bufferData) => {
        return parseJSON(bufferData.toString());
      })
    );
  } else {
    debugFunction(
      config?.isDebug,
      `file fileMapConfig is not exist ${config.snpFileMapConfig}`,
      '[updateFileMapConfig]'
    );
    return null;
  }
};
