import { availableTemplate } from '@/init';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(template: availableTemplate): Promise<string> {
  try {
    const repositoryUrl = `https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/${template}/repositoryMap.json`;
    const repositoryMapFiles = await wgetAsync(repositoryUrl + '/repositoryMap.json');

    console.log(repositoryUrl + '/repositoryMap.json');
    console.log(repositoryMapFiles);

    return 'JSON.parse(repositoryMapFiles);';
  } catch (err) {
    console.error('Błąd podczas pobierania configu z githuba', err);
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
