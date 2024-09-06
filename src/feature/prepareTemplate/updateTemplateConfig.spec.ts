import { updateTemplateConfig } from './updateTemplateConfig';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createFile } from '@/util/createFile';
import { readFile } from '@/util/readFile';

describe('updateTemplateConfig', () => {
  it('should update template config correctly', async () => {
    const config = { ...mockTemplateConfig.updateTemplateConfig };
    const fileList = ['file1.txt', 'file2.txt'];
    const templateFileList = ['template1.txt', 'template2.txt'];
    const rootPathFileList = ['/root/file1.txt', '/root/file2.txt'];

    await createFile({
      filePath: config.repositoryMapFilePath,
      content: JSON.stringify({}),
    });

    const result = await updateTemplateConfig({ config, fileList, templateFileList, rootPathFileList });

    const updatedConfig = JSON.parse(await readFile(config.repositoryMapFilePath));
    expect(updatedConfig.fileMap).toEqual(fileList);
    expect(updatedConfig.templateFileList).toEqual(templateFileList);
    expect(updatedConfig.rootPathFileList).toEqual(rootPathFileList);
  });
});
