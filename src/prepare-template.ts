#!/usr/bin/env node

import minimist from 'minimist';
import { ArgsTemplate } from '@/feature/args/argsTemplate';
import { getTemplateConfig } from '@/feature/config/defaultTemplateConfig';
import { ConfigTemplateType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';

export const prepareTemplate = async (args: ArgsTemplate): Promise<ConfigTemplateType> => {
  const config = await getTemplateConfig(args);

  debugFunction(config.isDebug, '=== Start prepare template ===', '[PrepareTemplate]');

  return config;
};

const args: ArgsTemplate = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

prepareTemplate(args)
  .then((config) => {
    finalConfig = config;
    return;
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[PrepareTemplate] final config');
    debugFunction(finalConfig?.isDebug, '=== Final prepare template ===', '[PrepareTemplate]');
  });
