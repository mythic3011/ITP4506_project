export class ImagePreviewManager {
    constructor(inputId, previewId) {
        this.input = document.getElementById(inputId);
        this.preview = document.getElementById(previewId);
        this.setupImagePreview();
    }

    setupImagePreview() {
        this.input.addEventListener('change', () => {
            this.showSelectedImages();
        });
    }

    showSelectedImages() {
        this.clearPreview();
        const files = this.input.files;

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                this.preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    showExistingImages(images) {
        this.clearPreview();
        images.forEach(image => {
            const img = document.createElement('img');
            img.src = image.url;
            this.preview.appendChild(img);
        });
    }

    clearPreview() {
        this.preview.innerHTML = '';
    }

    async getUploadedImages() {
        // In a real application, this would upload the images to a server
        // and return the URLs. For now, we'll just return placeholder URLs
        const files = this.input.files;
        return Array.from(files).map((file, index) => ({
            url: URL.createObjectURL(file)
        }));
    }
}