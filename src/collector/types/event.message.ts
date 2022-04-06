export interface EventMessage {
  worldId: string;
  eventName: string;
  environment: string;
  payload: Record<string, string>;
}
