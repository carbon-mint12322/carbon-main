import { getAllImageUrlsInObject } from '~/backendlib/util/getAllImageUrlsInObject';

const { expect } = require('chai');
const assert = require('assert');

describe('getImageUrlsFromNestedObject.test', () => {
  const obj = {
    name: 'Example',
    url: 'https://example.com',
    image: ['https://example.com/image1.jpg', 'https://example.com/image2.png'],
    nested: {
      imageUrl: 'https://example.com/nested/image.png',
      text: 'Some text',
      anotherNested: {
        img: [
          'https://example.com/anotherNested/image.gif',
          'https://example.com/anotherNested/image2.jpg',
        ],
        description: 'Another nested object',
      },
    },
  };

  it('should return an array of image URLs', () => {
    const imageUrls = getAllImageUrlsInObject(obj);
    expect(imageUrls)
      .to.be.an('array')
      .that.includes.members([
        'https://example.com/image1.jpg',
        'https://example.com/image2.png',
        'https://example.com/nested/image.png',
        'https://example.com/anotherNested/image.gif',
        'https://example.com/anotherNested/image2.jpg',
      ]);
  });

  it('should handle object values correctly', () => {
    const objWithObjects = {
      name: 'Example',
      images: {
        img1: 'https://example.com/img1.jpg',
        img2: 'https://example.com/img2.png',
      },
      nested: {
        images: {
          img3: 'https://example.com/img3.gif',
          img4: 'https://example.com/img4.jpg',
        },
      },
    };

    const imageUrls = getAllImageUrlsInObject(objWithObjects);
    expect(imageUrls)
      .to.be.an('array')
      .that.includes.members([
        'https://example.com/img1.jpg',
        'https://example.com/img2.png',
        'https://example.com/img3.gif',
        'https://example.com/img4.jpg',
      ]);
  });

  it('should handle non-image file types', () => {
    const objWithNonImages = {
      name: 'Example',
      url: 'https://example.com',
      files: [
        'https://example.com/document1.pdf',
        'https://example.com/document2.docx',
        'https://example.com/document3.txt',
      ],
      nested: {
        attachments: ['https://example.com/attachment1.zip', 'https://example.com/attachment2.rar'],
      },
    };

    const imageUrls = getAllImageUrlsInObject(objWithNonImages);
    expect(imageUrls).to.be.an('array').that.is.empty;
  });
});
