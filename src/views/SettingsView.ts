import { css, html } from 'lit';
import { Component } from '../litutil/Component.ts';

export class SettingsView extends Component {
	static styles = css`
		:host {
		}
	`;

	render() {
		return html`
			<p>SettingsView</p>
		`;
	}
}

customElements.define('mh-settings-view', SettingsView);
