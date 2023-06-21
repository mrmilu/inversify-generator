import { writeFile } from 'fs';

export function writeFilePromise(path: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(path, content, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}