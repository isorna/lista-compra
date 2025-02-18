import { getAPIData, getInputValue, API_PORT } from '../../index.shopping-list.js';
import { importTemplate } from '../../lib/importTemplate.js';
// @ ts-expect-error TS doesn't like this
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
// @ ts-expect-error TS doesn't like this
import AppCSS from '../../../css/app.css' with { type: 'css' }
// @ ts-expect-error TS doesn't like this
import LoginFormCSS from './LoginForm.css' with { type: 'css' }

const TEMPLATE = {
  id: 'loginFormTemplate',
  url: './js/components/LoginForm/LoginForm.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Login Form Web Component
 *
 * @class LoginForm
 * @property {string} prueba
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {
  static observedAttributes = ['prueba'];

  get prueba() {
    return this.getAttribute('prueba');
  }

  get template(){
    return document.getElementById(TEMPLATE.id);
  }

  constructor() {
    super()
  }
  // Login form methods
  async connectedCallback() {
    // console.log("constructor: Custom element added to page.");
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(ResetCSS, AppCSS, LoginFormCSS);

    this._setUpContent();
    // Add event listeners to form elements
    const form = this.shadowRoot.getElementById("loginForm");

    form.addEventListener("submit", this._onFormSubmit.bind(this));
  }

  disconnectedCallback() {
    console.log("disconnectedCallback: Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("adoptedCallback: Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`attributeChangedCallback: Attribute ${name} has changed.`, oldValue, newValue);
    this._setUpContent();
  }

  // Private Methods
  _setUpContent() {
    // Prevent render when disconnected or the template is not loaded
    if (this.shadowRoot && this.template) {
      // Replace previous content
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      // this.shadowRoot.innerHTML = `
      // <form id="loginForm">
      //   <label>Usuario: <input type="text" id="email" placeholder="email" /></label>
      //   <label>Contraseña: <input type="password" id="password" placeholder="contraseña" /></label>
      //   <button type="submit" id="loginButton" title="Login">Login</button>
      // </form>
      // `
    }
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
    // console.log(`DESDE DENTRO DEL COMPONENTE Email: ${loginData.email}, Password: ${loginData.password}`);

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