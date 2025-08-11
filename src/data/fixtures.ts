export const fixtures = {
  ocrSample: {
    form: 'VA Form 21-526EZ',
    fields: {
      veteranName: 'John Q. Example',
      fileNumber: '123456789',
      serviceBranch: 'US Army',
      conditionClaimed: 'Left knee osteoarthritis',
      onsetDate: '2009-05-14'
    }
  },
  transcriptSample: {
    text: 'Veteran reports chronic knee pain since 2009 after airborne training; pain worsened with activity. Uses brace; imaging shows osteophytes.',
    words: [],
    entities: [
      { type:'Condition', text:'knee pain' },
      { type:'Date', text:'2009' },
      { type:'Activity', text:'airborne training' }
    ]
  },
  kbResults: [
    { id: 'm21-1-v-iii-1', title: 'M21-1, Part V, Subpart iii, Chapter 1', snippet: 'Establishing service connection requires...'},
    { id: 'm21-1-v-iii-2', title: 'M21-1, Part V, Subpart iii, Chapter 2', snippet: 'When evaluating musculoskeletal conditions...'}
  ]
};
