'use strict';

const COLLECTION_PREFIX = 'careerai';

const prefixed = name => `${COLLECTION_PREFIX}${name}`;

module.exports = {
  COLLECTION_PREFIX,
  collections: {
    certifications: prefixed('Certifications'),
    tracks: prefixed('Tracks'),
    participants: prefixed('Participants'),
    enrollments: prefixed('Enrollments'),
  },
};
