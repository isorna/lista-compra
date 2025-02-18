import { getAPIData, getInputValue, API_PORT } from '../index.shopping-list.js';
import css from '../../css/styles.css' with { type: 'css' }
/**
 * Login Form Web Component
 *
 * @class LoginForm
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {
  constructor() {
    super()
  }
  // Funcionalidad propia del formulario de login
  connectedCallback() {
    console.log("Custom element added to page.");
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    shadow.adoptedStyleSheets.push(css);
    shadow.innerHTML = `
    <form id="loginForm">
      <label>Usuario: <input type="text" id="email" placeholder="email" /></label>
      <label>Contraseña: <input type="password" id="password" placeholder="contraseña" /></label>
      <button type="submit" id="loginButton" title="Login">Login</button>
    </form>
    `
    style.textContent = `
      form { border: 5px solid black;}
    `
    shadow.appendChild(style);
    // Add event listeners to form elements
    const form = shadow.getElementById("loginForm");

    form.addEventListener("submit", this.onFormSubmit.bind(this));
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`, oldValue, newValue);
  }

  // Private Methods

  async onFormSubmit(e) {
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