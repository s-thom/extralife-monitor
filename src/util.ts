import * as r2 from 'r2';

import Participant, { ParticipantData } from './types/Participant';
import Donation, { DonationData } from './types/Donation';

export async function getParticipantInfo(id: number): Promise<Participant> {
  const pInfo: ParticipantData = await r2
    // tslint:disable max-line-length
    .get(`http://extra-life.org/index.cfm?fuseaction=donorDrive.participant=&participantID=${id}&format=json`)
    // tslint:enable max-line-length
    .json;

  return new Participant(pInfo);
}

export async function getRecentDonations(participant: Participant): Promise<Donation[]> {
  const dInfo: DonationData[] = await r2
    // tslint:disable max-line-length
    .get(`http://extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID=${participant.id}&format=json`)
    // tslint:enable max-line-length
    .json;

  return dInfo.map(d => new Donation(d, participant));
}
