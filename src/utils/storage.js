// Local storage utilities for document persistence
class DocumentStorage {
  constructor() {
    this.dbName = 'VeteranLawAI_Documents';
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create documents store
        if (!db.objectStoreNames.contains('documents')) {
          const documentStore = db.createObjectStore('documents', { keyPath: 'id' });
          documentStore.createIndex('filename', 'filename', { unique: false });
          documentStore.createIndex('category', 'category', { unique: false });
          documentStore.createIndex('uploadDate', 'uploadDate', { unique: false });
          documentStore.createIndex('priority', 'priority', { unique: false });
        }

        // Create file blobs store
        if (!db.objectStoreNames.contains('fileBlobs')) {
          db.createObjectStore('fileBlobs', { keyPath: 'id' });
        }
      };
    });
  }

  async saveDocument(document, fileBlob = null) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents', 'fileBlobs'], 'readwrite');
      
      // Save document metadata
      const documentStore = transaction.objectStore('documents');
      const docRequest = documentStore.put(document);

      // Save file blob if provided
      if (fileBlob) {
        const blobStore = transaction.objectStore('fileBlobs');
        blobStore.put({ id: document.id, blob: fileBlob });
      }

      transaction.oncomplete = () => resolve(document);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getDocuments() {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents'], 'readonly');
      const store = transaction.objectStore('documents');
      const request = store.getAll();

      request.onsuccess = () => {
        const documents = request.result.sort((a, b) => 
          new Date(b.uploadDate) - new Date(a.uploadDate)
        );
        resolve(documents);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getDocument(id) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents'], 'readonly');
      const store = transaction.objectStore('documents');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFileBlob(id) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fileBlobs'], 'readonly');
      const store = transaction.objectStore('fileBlobs');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result?.blob);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDocument(id) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents', 'fileBlobs'], 'readwrite');
      
      // Delete from both stores
      transaction.objectStore('documents').delete(id);
      transaction.objectStore('fileBlobs').delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async updateDocument(id, updates) {
    await this.ensureDB();
    
    const document = await this.getDocument(id);
    if (!document) throw new Error('Document not found');

    const updatedDoc = { ...document, ...updates };
    return this.saveDocument(updatedDoc);
  }

  async ensureDB() {
    if (!this.db) {
      await this.initDB();
    }
  }

  // Export all documents as JSON
  async exportDocuments() {
    const documents = await this.getDocuments();
    return JSON.stringify(documents, null, 2);
  }

  // Import documents from JSON
  async importDocuments(jsonData) {
    const documents = JSON.parse(jsonData);
    const results = [];

    for (const doc of documents) {
      try {
        await this.saveDocument(doc);
        results.push({ id: doc.id, success: true });
      } catch (error) {
        results.push({ id: doc.id, success: false, error: error.message });
      }
    }

    return results;
  }

  // Clear all documents
  async clearAll() {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents', 'fileBlobs'], 'readwrite');
      
      transaction.objectStore('documents').clear();
      transaction.objectStore('fileBlobs').clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// Google Drive integration utilities
class GoogleDriveStorage {
  constructor() {
    this.accessToken = localStorage.getItem('gapi_access_token');
    this.refreshToken = localStorage.getItem('gapi_refresh_token');
    this.folderId = null;
    
    // These would be stored securely in production
    this.CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';
    this.API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'YOUR_API_KEY';
    this.DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
    this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
  }

  // Initialize Google API
  async init() {
    // In production, this would load the Google API client library
    // For now, we'll simulate the connection
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true;
        resolve(true);
      }, 1000);
    });
  }

  // Simulate OAuth flow
  async authenticate() {
    // In production, this would trigger Google OAuth
    return new Promise((resolve) => {
      // Simulate authentication
      const mockToken = 'mock_access_token_' + Date.now();
      localStorage.setItem('gapi_access_token', mockToken);
      this.accessToken = mockToken;
      this.connected = true;
      resolve({
        access_token: mockToken,
        expires_in: 3600
      });
    });
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.accessToken;
  }

  // Create VeteranLawAI folder if it doesn't exist
  async ensureFolder() {
    if (this.folderId) return this.folderId;

    // In production, this would use Google Drive API to create/find folder
    // Simulating folder creation
    this.folderId = 'veteranlawai_folder_' + Date.now();
    return this.folderId;
  }

  // Upload file to Google Drive
  async uploadFile(file, metadata = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Drive');
    }

    await this.ensureFolder();

    // In production, this would upload to Google Drive
    // For now, simulate the upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'gdrive_' + Date.now(),
          name: file.name,
          mimeType: file.type,
          webViewLink: `https://drive.google.com/file/d/${Date.now()}/view`,
          webContentLink: `https://drive.google.com/uc?id=${Date.now()}&export=download`,
          size: file.size,
          createdTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString()
        });
      }, 1500);
    });
  }

  // Download file from Google Drive
  async downloadFile(fileId) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Drive');
    }

    // In production, this would download from Google Drive
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Blob(['Mock file content'], { type: 'text/plain' }));
      }, 1000);
    });
  }

  // List files in the VeteranLawAI folder
  async listFiles() {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Drive');
    }

    // In production, this would list files from Google Drive
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'gdrive_1',
            name: 'VA_Form_21-526EZ.pdf',
            mimeType: 'application/pdf',
            size: 1024000,
            modifiedTime: new Date().toISOString()
          },
          {
            id: 'gdrive_2',
            name: 'DD-214_Service_Record.pdf',
            mimeType: 'application/pdf',
            size: 512000,
            modifiedTime: new Date().toISOString()
          }
        ]);
      }, 1000);
    });
  }

  // Delete file from Google Drive
  async deleteFile(fileId) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Drive');
    }

    // In production, this would delete from Google Drive
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  // Disconnect from Google Drive
  disconnect() {
    localStorage.removeItem('gapi_access_token');
    localStorage.removeItem('gapi_refresh_token');
    this.accessToken = null;
    this.refreshToken = null;
    this.connected = false;
  }
}

// OCR Service (using Tesseract.js for client-side OCR)
class OCRService {
  constructor() {
    this.worker = null;
  }

  async init() {
    // In production, load Tesseract.js worker
    // For now, we'll simulate OCR
    this.initialized = true;
  }

  async processImage(imageFile) {
    // Simulate OCR processing with realistic progress updates
    const progress = { status: 'initializing', progress: 0 };
    
    return new Promise((resolve) => {
      // Simulate different processing stages
      const stages = [
        { status: 'loading_image', progress: 10 },
        { status: 'preprocessing', progress: 30 },
        { status: 'recognizing_text', progress: 60 },
        { status: 'postprocessing', progress: 90 },
        { status: 'complete', progress: 100 }
      ];

      let currentStage = 0;
      const interval = setInterval(() => {
        if (currentStage < stages.length) {
          progress.status = stages[currentStage].status;
          progress.progress = stages[currentStage].progress;
          
          if (progress.onProgress) {
            progress.onProgress(progress);
          }
          
          currentStage++;
        } else {
          clearInterval(interval);
          
          // Generate realistic OCR result based on filename
          const text = this.generateMockOCR(imageFile.name);
          resolve({
            text,
            confidence: 0.95 + Math.random() * 0.04,
            lines: text.split('\n').length,
            words: text.split(/\s+/).length
          });
        }
      }, 400);
    });
  }

  generateMockOCR(filename) {
    const lower = filename.toLowerCase();
    
    if (lower.includes('21-526')) {
      return `VA FORM 21-526EZ
APPLICATION FOR DISABILITY COMPENSATION AND RELATED COMPENSATION BENEFITS

Section I - Veteran Information
Name: [REDACTED]
Social Security Number: XXX-XX-XXXX
VA File Number: XXXXXXXXX
Date of Birth: [REDACTED]
Service Number: [REDACTED]

Section II - Service Information
Branch of Service: U.S. Army
Service Dates: 01/15/2003 - 06/30/2011
Character of Discharge: Honorable

Section III - Disabilities
1. Post-Traumatic Stress Disorder (PTSD)
   - Date disability began: 2011
   - Treatment facility: VA Medical Center
   
2. Bilateral Hearing Loss
   - Date disability began: 2010
   - Related to military noise exposure
   
3. Tinnitus
   - Date disability began: 2010
   - Constant ringing in both ears

Section IV - Medical Treatment
Currently receiving treatment at: [REDACTED] VA Medical Center
Primary Care Provider: Dr. [REDACTED]
Last Appointment: [RECENT DATE]`;
    }
    
    if (lower.includes('dd-214') || lower.includes('dd214')) {
      return `CERTIFICATE OF RELEASE OR DISCHARGE FROM ACTIVE DUTY

1. NAME: [REDACTED]
2. SOCIAL SECURITY NUMBER: XXX-XX-XXXX
3. GRADE, RATE OR RANK: E-5
4. PAY GRADE: E-5
5. DATE OF BIRTH: [REDACTED]
6. RESERVE OBLIGATION TERMINATION DATE: [DATE]
7. PLACE OF ENTRY INTO ACTIVE DUTY: [LOCATION]
8. HOME OF RECORD AT TIME OF ENTRY: [ADDRESS]
9. COMMAND TO WHICH TRANSFERRED: USAR CONTROL GROUP

SERVICE INFORMATION:
- Date Entered Active Duty: [DATE]
- Separation Date: [DATE]
- Net Active Service: 8 Years, 5 Months, 15 Days
- Foreign Service: 3 Years, 2 Months, 10 Days

DECORATIONS, MEDALS, BADGES:
- Bronze Star Medal
- Purple Heart
- Army Commendation Medal (2)
- Iraq Campaign Medal
- Afghanistan Campaign Medal
- National Defense Service Medal

CHARACTER OF SERVICE: Honorable`;
    }
    
    // Default medical record format
    return `MEDICAL EXAMINATION REPORT

Patient Name: [REDACTED]
Date of Examination: ${new Date().toLocaleDateString()}
Examiner: Dr. [REDACTED]

Chief Complaint:
Chronic lower back pain with radiculopathy

History of Present Illness:
Patient reports persistent lower back pain since military service. Pain radiates down left leg. 
Symptoms worsen with prolonged standing or sitting. Pain level 7/10 on average.

Physical Examination:
- Limited range of motion in lumbar spine
- Positive straight leg raise test on left
- Decreased sensation in L5 distribution
- Muscle strength 4/5 in left lower extremity

Assessment:
1. Lumbar disc herniation L4-L5
2. Left L5 radiculopathy
3. Chronic pain syndrome

Plan:
- Continue physical therapy
- MRI lumbar spine
- Pain management referral
- Consider epidural steroid injection`;
  }

  destroy() {
    // Clean up worker if using real Tesseract.js
    if (this.worker) {
      this.worker.terminate();
    }
  }
}

// Export singleton instances
export const documentStorage = new DocumentStorage();
export const googleDriveStorage = new GoogleDriveStorage();
export const ocrService = new OCRService();

// Export classes for testing or multiple instances
export { DocumentStorage, GoogleDriveStorage, OCRService };