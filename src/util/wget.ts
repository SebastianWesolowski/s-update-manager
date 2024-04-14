import wget from 'node-wget';

export const wgetAsync = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    wget({ url }, (err: any, response: any, content: string | PromiseLike<string>) => {
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
};
