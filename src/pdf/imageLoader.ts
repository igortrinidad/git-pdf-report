import https from 'https'
export default ({ imageUrl, onProgress = null, returnsBase64 = true }: { imageUrl: string, onProgress?: (progress: number) => void | null, returnsBase64?: boolean }): Promise<string | void> => {
  return new Promise((resolve, reject) => {

    const parsedUrl = new URL(imageUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname,
      method: 'GET',
      responseType: 'arraybuffer'
    };

    const req = https.request(options, (res) => {
      let data: Uint8Array[] = [];
      let totalBytes = parseInt(res.headers['content-length'] || '0');
      let receivedBytes = 0;

      res.on('data', (chunk: Uint8Array) => {
        data.push(chunk);
        receivedBytes += chunk.length;

        if (onProgress && totalBytes > 0) {
          const progress = Math.round((receivedBytes / totalBytes) * 100);
          onProgress(progress);
        } else {
          if (onProgress) onProgress(-1);
        }
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
          return;
        }

        const buffer = Buffer.concat(data);
        const contentType = res.headers['content-type'];

        if (!contentType || !contentType.includes('image')) {
          reject(new Error('Response is not an image'));
          return;
        }

        if (!returnsBase64) {
          resolve();
        } else {
          const base64String = buffer.toString('base64');
          resolve(`data:${contentType};base64,${base64String}`);
        }
      });
    });

    req.on('error', (err: Error) => {
      resolve()
    })

    req.end()
  })
};
