#!/usr/bin/env node

import minimist from 'minimist';
import { ArgsTemplate } from '@/feature/args/argsTemplate';
import { getTemplateConfig } from '@/feature/config/defaultTemplateConfig';
import { ConfigTemplateType } from '@/feature/config/types';
import { bumpVersion } from '@/feature/prepareTemplate/bumpVersion';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';

export const prepareTemplate = async (args: ArgsTemplate): Promise<ConfigTemplateType> => {
  const config: ConfigTemplateType = await getTemplateConfig(args);

  debugFunction(config.isDebug, '=== Start prepare template ===', '[PrepareTemplate]');

  if (!(await isFileExists(config.repositoryMapFilePath)) || process.env.SDEBUG !== 'true') {
    const defaultValue = {
      templateVersion: '1.0.0',
      fileMap: [],
    };

    await createFile({
      filePath: config.repositoryMapFilePath,
      content: JSON.stringify(defaultValue),
      isDebug: config.isDebug,
    });
    config.bumpVersion = false;
  }

  return config;
};

const args: ArgsTemplate = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

prepareTemplate(args)
  .then((config) => {
    finalConfig = config;
    return bumpVersion(config);
  })

  // 1. **Check if `repositoryMap.json` exists:**
  // - If the file **does not exist**, proceed to step 2.
  // - If the file **exists**, proceed to step 3.
  //
  // 2. **Create `repositoryMap.json` file:**
  // - Set the file version to `1.0.0`.
  //
  // 3. **If `repositoryMap.json` already exists:**
  // - Bump the version in the file according to `semver` (e.g., `1.0.0` → `1.0.1`).
  //
  // 4. **Scan all files in the project:**
  // - Identify files that should be added to `repositoryMap.json`.
  // - Add the paths of these files to an array.
  //
  // 5. **For each file added to the array:**
  // - Create basic files with instructions and default values:
  //     - **Instructions**: Create template instructions that are appropriate for the file.
  // - **Default Values**: Define default configuration values.
  //
  // 6. **Generate content for each file:**
  // - Ensure each file contains appropriate content based on its type or purpose.
  // - Save the changes to the respective files.
  //
  // 7. **Test the final result:**
  // - Ensure `repositoryMap.json` contains the updated information.
  // - Verify that all files were correctly generated and contain the expected content.
  //
  // 8. **Finalize and commit changes to version control:**
  // - Review the changes and ensure all steps were completed correctly.
  // - Commit the files with an appropriate commit message describing the changes made.

  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[PrepareTemplate] final config');
    debugFunction(finalConfig?.isDebug, '=== Final prepare template ===', '[PrepareTemplate]');
  });
