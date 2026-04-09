import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import ParticipantDetailController from '../participantDetailController';
import {
  allParticipantDetailMocks,
  allParticipantDetailMocksEmpty,
  MOCK_PARTICIPANT_ID,
} from './participantDetailMocks';

const mockMatch = {
  params: { id: MOCK_PARTICIPANT_ID },
  isExact: true,
  path: '/participant/:id',
  url: `/participant/${MOCK_PARTICIPANT_ID}`,
};

export const ParticipantDetailMockPage = () => (
  <MockedProvider mocks={allParticipantDetailMocks} addTypename={false}>
    <ParticipantDetailController match={mockMatch} />
  </MockedProvider>
);

export const ParticipantDetailEmptyMockPage = () => (
  <MockedProvider mocks={allParticipantDetailMocksEmpty} addTypename={false}>
    <ParticipantDetailController match={mockMatch} />
  </MockedProvider>
);

export default ParticipantDetailMockPage;
