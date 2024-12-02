export class LicensingService {
    constructor() {
        this.validStatuses = ['pending', 'submitted', 'approved', 'rejected'];
    }

    async updateLicensingStatus(orderId, newStatus, documents = []) {
        if (!this.validStatuses.includes(newStatus)) {
            throw new Error('Invalid licensing status');
        }

        try {
            const orders = JSON.parse(localStorage.getItem('LMC_Orders')) || [];
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            // Update status
            orders[orderIndex].licensingStatus = newStatus;

            // Add new documents if provided
            if (documents.length > 0) {
                if (!orders[orderIndex].licensingDocuments) {
                    orders[orderIndex].licensingDocuments = [];
                }

                const newDocs = documents.map(doc => ({
                    id: this.generateDocumentId(),
                    fileName: doc.name,
                    fileType: doc.type,
                    uploadDate: new Date().toISOString(),
                    status: 'pending'
                }));

                orders[orderIndex].licensingDocuments.push(...newDocs);
            }

            localStorage.setItem('LMC_Orders', JSON.stringify(orders));
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating licensing status:', error);
            throw new Error('Failed to update licensing status');
        }
    }

    generateDocumentId() {
        return 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    validateDocuments(documents) {
        const requiredDocuments = ['drivers_license', 'insurance_proof', 'registration'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

        documents.forEach(doc => {
            if (!allowedTypes.includes(doc.type)) {
                throw new Error(`Invalid file type for ${doc.name}. Allowed types: PDF, JPEG, PNG`);
            }

            if (doc.size > maxFileSize) {
                throw new Error(`File ${doc.name} exceeds maximum size of 5MB`);
            }
        });

        return true;
    }
}