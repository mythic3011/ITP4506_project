export class DocumentUploadService {
    constructor() {
        this.storageKey = 'LMC_Documents';
    }

    async uploadDocument(orderId, formData) {
        try {
            // In a real application, this would make an API call to upload the document
            const documents = this.getDocuments();
            const newDocument = {
                id: this.generateDocumentId(),
                orderId,
                type: formData.get('documentType'),
                fileName: formData.get('documentFile').name,
                uploadDate: new Date().toISOString()
            };

            documents.push(newDocument);
            localStorage.setItem(this.storageKey, JSON.stringify(documents));

            return newDocument;
        } catch (error) {
            console.error('Error uploading document:', error);
            throw new Error('Failed to upload document');
        }
    }

    getDocuments() {
        const documentsData = localStorage.getItem(this.storageKey);
        return documentsData ? JSON.parse(documentsData) : [];
    }

    generateDocumentId() {
        return 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}