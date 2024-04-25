import Image from 'next/image';
import React, { useState } from 'react';
import nopreview from '../public/assets/images/nopreview.png';

export default function CustomImage(source: any, key: number) {
  const [src, setSrc] = useState(source);
  return (
    <Image
      {...src}
      src={src?.source || src}
      width={60}
      height={60}
      alt={'no image'}
      onError={() => setSrc(nopreview.src)}
      key={key}
    />
  );
}
