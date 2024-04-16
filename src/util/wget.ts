import wget from 'node-wget';
import { createFile } from '@/util/createFile';

export const wgetAsync = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    createFile({
      filePath: './temporary/readme.md',
      content: 'temp folder for downloaded file',
    }).then(() => {
      wget({ url, dest: './temporary/' }, (err: any, response: any, content: string | PromiseLike<string>) => {
        if (err) {
          reject(err);
        } else {
          if (content === '404: Not Found') {
            resolve('');
          }
          resolve(content);
        }
      });
    });
  });
};
