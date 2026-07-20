import { dataEngineeringTerms } from './data-engineering/index.js';

export const tracks = [
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    terms: dataEngineeringTerms,
    termCount: dataEngineeringTerms.length,
  },
];

export const allTerms = tracks.flatMap((track) => track.terms);

export function getTermById(id) {
  return allTerms.find((term) => term.id === id);
}

export function getTrackById(id) {
  return tracks.find((track) => track.id === id);
}
