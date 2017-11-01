interface ParticipantData {
  displayName: string;
  totalRaisedAmount: number;
  fundraisingGoal: number;
  participantID: number;
  avatarImageURL: string;
}

export default class Participant {
  // Properties are r/w privately, but readonly publicly
  // Allows Participant to be updated internally
  // tslint:disable variable-name
  private _name: string;
  private _goal: number;
  private _raised: number;
  private _id: number;
  private _avatar: string;
  // tslint:enable variable-name

  constructor(data: ParticipantData) {
    this._name = data.displayName;
    this._goal = data.fundraisingGoal;
    this._raised = data.totalRaisedAmount;
    this._id = data.participantID;
    this._avatar = data.avatarImageURL;
  }

  public get name() {
    return this._name;
  }

  public get goal() {
    return this._goal;
  }

  public get raised() {
    return this._raised;
  }

  public get id() {
    return this._id;
  }

  public get avatar() {
    return this._avatar;
  }
}
