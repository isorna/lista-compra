import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { importTemplate } from '../../lib/importTemplate.js';
// @ ts-expect-error TS doesn't like this
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
// @ ts-expect-error TS doesn't like this
import AppCSS from '../../../css/app.css' with { type: 'css' }
// @ ts-expect-error TS doesn't like this
import LoginFormCSS from '../LoginForm/LoginForm.css' with { type: 'css' }

const TEMPLATE = {
  id: 'loginFormTemplate',
  url: './js/components/LoginForm/LoginForm.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

export class LoginForm extends LitElement {
  static styles = [ResetCSS, AppCSS, LoginFormCSS];

  static properties = {
    prueba: {type: String},
  };

  constructor() {
    super();
  }

  render() {
    let template = document.getElementById(TEMPLATE.id)

    if (template?.innerHTML) {
      template = html`${template.innerHTML}`
    }

    template = html`
      <slot></slot>
  <form id="loginForm">
    <label>Usuario: ${this.prueba} <input type="text" id="email" placeholder="email" /></label>
    <label>Contraseña: <input type="password" id="password" placeholder="contraseña" /></label>
    <button type="submit" id="loginButton" title="Login">Login</button>
    <slot name="error"></slot>
  </form>
    `

    return template;
  }
}

customElements.define('login-form', LoginForm);