import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 as uuid } from "uuid";
import { appConfig } from "./config";


export async function saveImage(image: UploadedFile) {
    const extension = image.name.substring(image.name.lastIndexOf("."))
    const fileName = uuid() + extension;
    const fullPath = path.join(appConfig.imagesPath + fileName);
    await image.mv(fullPath);
    return fileName;
}

