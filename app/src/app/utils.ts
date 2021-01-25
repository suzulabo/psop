export const concatArray = (...arrays: Uint8Array[]) => {
  const len = arrays.reduce((acc, array) => {
    return acc + array.byteLength;
  }, 0);
  const result = new Uint8Array(len);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.byteLength;
  }
  return result;
};

/*
https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
*/
export const humanFileSize = (size: number) => {
  if (size < 0) {
    return '';
  }
  if (size == 0) {
    return '0 B';
  }
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return Number((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  //return Number((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'KiB', 'MiB', 'GiB', 'TiB'][i];
};

export const readFile = (f: Blob, progress?: (loaded: number) => void) => {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      resolve(new Uint8Array(ev.target.result as ArrayBuffer));
    };
    reader.onerror = ev => {
      reject(ev.target.error);
    };
    reader.onprogress = ev => {
      if (progress) {
        progress(ev.loaded);
      }
    };

    reader.readAsArrayBuffer(f);
  });
};
