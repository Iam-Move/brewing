export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return '';
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // set canvas width to final desired crop size - this will clear existing context
    const MAX_SIZE = 500; // Resize to max 500px
    let finalWidth = pixelCrop.width;
    let finalHeight = pixelCrop.height;

    if (finalWidth > MAX_SIZE) {
        finalWidth = MAX_SIZE;
        finalHeight = MAX_SIZE; // Assumes 1:1 aspect ratio
    }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // If resizing is needed (putImageData puts exact pixels), we might need another pass or just drawImage with args
    // For simplicity with putImageData (which is pixel exact), let's re-draw if we want resizing, 
    // but putImageData replaces content. 
    // Better approach for resizing: Draw the cropped part onto a new canvas of desired size.

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = pixelCrop.width;
    tempCanvas.height = pixelCrop.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
        tempCtx.putImageData(data, 0, 0);
    }

    // Draw from tempCanvas to final canvas with resizing
    ctx.drawImage(tempCanvas, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, finalWidth, finalHeight);

    // As Base64 string
    return canvas.toDataURL('image/jpeg', 0.8); // Compress quality 0.8
}
