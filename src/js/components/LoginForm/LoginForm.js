import { getAPIData, getInputValue, API_PORT } from '../../index.shopping-list.js';
import AppCSS from '../../../css/app.css' with { type: 'css' }
import LoginFormCSS from './LoginForm.css' with { type: 'css' }
/**
 * Login Form Web Component
 *
 * @class LoginForm
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {
  static observedAttributes = ['prueba'];

  constructor() {
    super()
  }
  // Funcionalidad propia del formulario de login
  connectedCallback() {
    console.log("Custom element added to page.");
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(AppCSS, LoginFormCSS);

    this._setUpContent();
    // Add event listeners to form elements
    const form = this.shadowRoot.getElementById("loginForm");

    form.addEventListener("submit", this._onFormSubmit.bind(this));
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`, oldValue, newValue);
    this._setUpContent();
  }

  // Private Methods
  _setUpContent() {
    this.shadowRoot.innerHTML = `
    <form id="loginForm">
      <label>Usuario: <input type="text" id="email" placeholder="email" /></label>
      <label>Contraseña: <input type="password" id="password" placeholder="contraseña" /></label>
      <button type="submit" id="loginButton" title="Login">Login</button>
    </form>
    `
  }

  async _onFormSubmit(e) {
    e.preventDefault();
    const email = this.shadowRoot.getElementById("email");
    const password = this.shadowRoot.getElementById("password");
    const loginData = {
      email: getInputValue(email),
      password: getInputValue(password)
    }
    let onFormSubmitEvent
    console.log(`DESDE DENTRO DEL COMPONENTE Email: ${loginData.email}, Password: ${loginData.password}`);

    if (loginData.email !== '' && loginData.password !== '') {
      const payload = JSON.stringify(loginData)
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: apiData
      })
    } else {
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: null
      })
    }

    this.dispatchEvent(onFormSubmitEvent);
  }
}

customElements.define('login-form', LoginForm);