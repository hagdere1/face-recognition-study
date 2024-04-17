// @ts-ignore
// const images = require.context('../images', true);
// @ts-ignore
const images = require.context('../images/final', false);
const imageList = images.keys().map((image: any) => images(image));

export const getT1Images = () => {
    return imageList.filter((image: any) => image.default.src.includes('t1_'))
}

export const getT2Images = () => {
    return imageList.filter((image: any) => image.default.src.includes('t2_'))
}