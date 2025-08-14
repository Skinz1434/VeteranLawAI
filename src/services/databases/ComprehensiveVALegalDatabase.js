// src/services/databases/ComprehensiveVALegalDatabase.js

/**
 * A comprehensive, yet mock, database for VA legal documents.
 * In a real application, this would connect to a backend service like Firestore or a dedicated search API.
 */
class VALegalDatabase {
  constructor() {
    this.documents = [
      {
        id: 'cfr_38_3_309',
        type: 'regulation',
        title: '38 CFR § 3.309 - Disease subject to presumptive service connection.',
        summary: 'Details diseases that are presumed to be service-connected if they manifest to a degree of 10 percent or more within certain time limits following service.',
        section: '§ 3.309',
        lastUpdated: '2023-05-12T00:00:00.000Z',
        relevanceScore: 0.98,
        keywords: ['presumptive', 'disease', 'service connection'],
        content: 'Full text of 38 CFR § 3.309 would be included here...'
      },
      {
        id: 'm21_1_iv_ii_2_b',
        type: 'manual',
        title: 'M21-1, Part IV, Subpart ii, Chapter 2, Section B - Developing for PTSD Claims',
        summary: 'Provides guidance on developing claims for post-traumatic stress disorder (PTSD), including handling of stressor evidence and scheduling examinations.',
        section: 'IV.ii.2.B',
        lastUpdated: '2023-08-01T00:00:00.000Z',
        relevanceScore: 0.95,
        keywords: ['ptsd', 'm21-1', 'stressor', 'development'],
        content: 'Full text of the M21-1 section would be included here...'
      },
      {
        id: 'nieves_rodriguez_v_peake',
        type: 'case_law',
        title: 'Nieves-Rodriguez v. Peake, 22 Vet.App. 295 (2008)',
        summary: 'A key case establishing that a medical opinion does not need to be expressed with a particular degree of certainty to be considered probative.',
        section: '22 Vet.App. 295',
        lastUpdated: '2008-11-20T00:00:00.000Z',
        relevanceScore: 0.92,
        keywords: ['medical opinion', 'probative', 'certainty', 'nexus'],
        content: 'Full summary and legal analysis of the case would be here...'
      },
    ];
    this.bookmarks = new Set(['m21_1_iv_ii_2_b']);
  }

  getAllDocuments(options = {}) {
    if (options.type && options.type !== 'all') {
      return this.documents.filter(doc => doc.type === options.type);
    }
    return this.documents;
  }

  search(query, options = {}) {
    const lowerQuery = query.toLowerCase();
    return this.getAllDocuments(options).filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.summary.toLowerCase().includes(lowerQuery) ||
      (doc.keywords && doc.keywords.some(k => k.toLowerCase().includes(lowerQuery)))
    );
  }
  
  getDocumentCount() {
    return this.documents.length;
  }

  addBookmark(docId) {
    this.bookmarks.add(docId);
  }
  
  removeBookmark(docId) {
    this.bookmarks.delete(docId);
  }

  isBookmarked(docId) {
    return this.bookmarks.has(docId);
  }

  getBookmarks() {
    return Array.from(this.bookmarks).map(id => this.documents.find(doc => doc.id === id));
  }
}

// Export a singleton instance to be used across the application
export const legalDatabase = new VALegalDatabase();
