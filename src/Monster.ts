export default class Monster {
  public readonly name: string

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  public toString(): string {
    return `PocketMonster<name: "${this.name}">`;
  }
}
