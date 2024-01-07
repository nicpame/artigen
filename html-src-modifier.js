const l = console.log;

const cheerio = require('cheerio');
let htmlText = `
<div>
<img class="lazyload " alt="15 Charming Ideas to Add a Chesterfield Sofa to Your Living Room" style="width:100%; height:0;padding-top: 66.66%" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/photos/419/chesterfield-sofa-1.jpeg?s=b1">
</div>
<p>15 Charming Ideas to Add a Chesterfield Sofa to Your Living Room</p>
</a>
<a class="fo4-category-item" title="Colors that Go with Gray Sofa" href="/colors-that-go-with-gray-sofa">
<div>
<img class="lazyload " alt="Colors that Go with Gray Sofa" style="width:100%; height:0;padding-top: 66.66%" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/photos/420/gray-sofa-1.jpeg?s=b1">
</div>
`;

const url = require('url');
function convertRelativeUrlToAbsolute(relativePath, baseUrl) {
  return url.resolve(baseUrl, relativePath);
}

function findsBestPossibleImageUrl(imageHtmlTagObject, baseUrl) {
  const absoluteUrlPattern = new RegExp('^(?:[a-z]+:)?//', 'i');
  const relativeUrlPattern = new RegExp('^/[^/].*?$');

  for (let key in imageHtmlTagObject) {
    if (absoluteUrlPattern.test(imageHtmlTagObject[key])) {
      return imageHtmlTagObject[key];
    } else if (relativeUrlPattern.test(imageHtmlTagObject[key])) {
      return convertRelativeUrlToAbsolute(imageHtmlTagObject[key], baseUrl);
    }
  }

  return null;
}
function alterImageSrc(htmlText, baseUrl) {
  const $ = cheerio.load(htmlText);

  $('img').each(function () {
    const oldSrc = $(this).attr('src');
    const newSrc = findsBestPossibleImageUrl($(this).attr(), baseUrl);
    $(this).attr('src', newSrc);
  });

  return $.html();
}
l(alterImageSrc(htmlText, 'https://deed.com'));
