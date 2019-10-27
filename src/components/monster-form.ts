import Monster from '../Monster';
import { html, render, TemplateResult } from 'lit-html';

export default class MonsterForm extends HTMLElement {
  public get monster(): Monster {
    return this._monster;
  }
  public set monster(newValue: Monster) {
    this._monster = newValue

    this.render();
  }

  private _monster: Monster = new Monster({ name: "" });

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  private get template(): TemplateResult {
    return html`<form>
      <h1>PocketMonster</h1>
      <label>name<input value=${this.monster.name}></label
      <button type="button"></buttion>
    </form>`;
  }

  private render() {
    render(this.template, this.shadowRoot);
  }
}

window.customElements.define('monster-form', MonsterForm);
