import wget from 'node-wget';

export const wgetAsync = async (url: string, temporaryFolder?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    wget(
      { url, dest: temporaryFolder ? temporaryFolder : './temporary/' },
      (err: any, response: any, content: string | PromiseLike<string>) => {
        if (err) {
          reject(err);
        } else {
          if (content === '404: Not Found') {
            resolve('');
          }
          resolve(content);
        }
      }
    );
  });
};
