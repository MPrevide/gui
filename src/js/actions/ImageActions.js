import imageManager from 'Comms/ImageManager';
import toaster from 'Comms/util/materialize';

const alt = require('../alt');

class ImageActions {
    updateImages(images) {
        return images;
    }

    updateImageData(id, label, value) {
        return { id, label, value };
    }

    fetchImages(templateId) {
      return (dispatch) => {
        dispatch();

        imageManager.getImages(templateId).then((imageList) => {
          this.updateImages(imageList);
        })
        .catch((error) => {
          this.imagesFailed(error);
        });
      };
    }


    triggerUpdate(image, cb) {
        return (dispatch) => {
            dispatch();
            imageManager.setBinary(image)
                .then((response) => {
                    this.updateSingle(response.image);
                    if (cb) {
                        cb(response.image);
                    }
                })
                .catch((error) => {
                    this.imagesFailed(error);
                });
        };
    }

    updateSingle(imageId) {
        return imageId;
    }

    fetchSingle(label, callback) {
        return (dispatch) => {
            dispatch();

            imageManager.getImages(label)
                .then((images) => {
                    this.updateImages(images);
                    if (callback) {
                        callback(images);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch images', error);
                    this.imagesFailed(error);
                });
        };
    }


    insertEmptyImage(image) {
        return image;
    }


    insertImage(image, oldimage) {
        return { image, oldimage };
    }

    triggerInsert(image, cb) {
        const newimage = image;
        return (dispatch) => {
            dispatch();
            imageManager.addImage(newimage)
                .then((response) => {
                    this.insertImage(response, newimage);
                    if (cb) {
                        cb(response, newimage);
                    }
                })
                .catch((error) => {
                    this.imagesFailed(error);
                });
        };
    }

    triggerRemovalBinary(imageId, cb) {
        return (dispatch) => {
            dispatch();
            imageManager.deleteBinary(imageId)
                .then((response) => {
                    if (response.result === 'ok') {
                        this.removeSingleBinary(imageId);
                        if (cb) {
                            cb(response);
                        }
                    } else {
                        this.imagesFailed('Failed to remove given image');
                    }
                })
                .catch((error) => {
                    this.imagesFailed('Failed to remove given image');
                });
        };
    }

    removeSingleBinary(id) {
        return id;
    }

    triggerRemoval(image, cb) {
        return (dispatch) => {
            dispatch();
            imageManager.deleteImage(image.id)
                .then((response) => {
                    const respJson = JSON.parse(response);
                    if (respJson.result === 'ok') {
                        this.removeSingle(respJson.removed_image.id);
                        if (cb) {
                            cb(response);
                        }
                    } else {
                        this.imagesFailed('Failed to remove given image');
                    }
                })
                .catch((error) => {
                    this.imagesFailed('Failed to remove given image');
                });
        };
    }

    removeSingle(id) {
        return id;
    }

    imagesFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

alt.createActions(ImageActions, exports);
