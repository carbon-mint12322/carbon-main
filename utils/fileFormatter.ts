export const dataURLToBlob = (dataUrl: string, contentType: string) => {
  try {
    if (dataUrl && contentType) {
      let ab = new ArrayBuffer(dataUrl.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < dataUrl.length; i++) {
        ia[i] = dataUrl.charCodeAt(i);
      }
      return new Blob([ab], { type: contentType });
    }
    return dataUrl;
  } catch (error: any) {
    console.error(error);
    throw new Error(JSON.parse(JSON.stringify(error.message)));
  }
};

export const dataURLToFile = (dataUrl: string) => {
  try {
    const regex = /^data:(.+);name=(.+);base64,(.*)$/;
    const matches = dataUrl.match(regex);
    if (matches && matches.length > 0) {
      const contentType = matches[1];
      const filename = matches[2];
      const data = matches[3];

      const blob = dataURLToBlob(data, contentType);
      const resultFile = new File([blob], filename);
      return resultFile;
    }
    return dataUrl;
  } catch (error) {
    console.error(error);
    return dataUrl;
  }
};

export const stringToFileName = (dataUrl: string) => {
  try {
    const regex = /^data:(.+);name=(.+);base64,(.*)$/;
    const matchesDataUrl = dataUrl.match(regex);
    if (matchesDataUrl && matchesDataUrl.length > 0) {
      return matchesDataUrl[2];
    } else {
      const linkRegex = /\/api\/file\/public\?id=\/gridfs:(.+)\/(.*)$/;
      const matchesLink = dataUrl.match(linkRegex);
      if (matchesLink && matchesLink.length > 0) {
        return matchesLink[2];
      }
    }
    return dataUrl;
  } catch (error) {
    console.error(error);
    return dataUrl;
  }
};

export const fetchFileType = (dataUrl: string) => {
  try {
    const regex = /^data:(.+)\/(.+);name=(.+);base64,(.*)$/;
    const matchesDataUrl = dataUrl.match(regex);
    if (matchesDataUrl && matchesDataUrl.length > 0) {
      return matchesDataUrl[1];
    } else {
      const linkRegex = /\/api\/file\/public\?id=\/gridfs:(.+)\/(.+)-(.+)--(.*)$/;
      const matchesLink = dataUrl.match(linkRegex);
      if (matchesLink && matchesLink.length > 0) {
        return matchesLink[2];
      }
    }
    return dataUrl;
  } catch (error) {
    console.error(error);
    return dataUrl;
  }
};

export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileType = (fileReader.result as string)?.split(',')?.[0]?.split(';')?.[0];
        const fileName = file.name;
        const base64String = (fileReader.result as string)
          ?.replace('data:', '')
          ?.replace(/^.+,/, '');
        const base64Url = `${fileType};name=${fileName};base64,${base64String}`;
        resolve(base64Url);
      };
      fileReader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export const isDataUrl = (dataUrl: string) => {
  try {
    const regex = /^data:(.*)$/;
    const matchesDataUrl = dataUrl.match(regex);
    if (matchesDataUrl && matchesDataUrl.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
