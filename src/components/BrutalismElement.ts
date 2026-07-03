import { css, html } from 'lit';
import { property } from 'lit/decorators/property.js';
import { Component } from '../litutil/Component.ts';
import type { BackgroundNames, BorderWidthNames, InkNames, PopNames, RadiusNames } from '../services/theme.ts';

export class BrutalismElement extends Component {
	static styles = css`
		:host {
			display: block;
			box-shadow: var(--shadow-offset-x) var(--shadow-offset-y) 0px var(--shadow-color);
			transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
		}
	`;

	@property()
	variant: PopNames | BackgroundNames = 'pop-1';

	@property()
	radius: RadiusNames = 'sharp';

	@property()
	color: InkNames = 'main';

	@property()
	border: BorderWidthNames = 'thick';


	get variantStyles() {
		return html`
			<style>
				:host {
					background-color: var(--${this.variant});
					color: var(--ink-${this.color});
					border: var(--border-${this.border}) solid var(--border-color);
					border-radius: var(--radius-${this.radius});
				}
			</style>
		`;
	}


	render() {
		return html`
			${this.variantStyles}
			<slot></slot>
		`;
	}
}

customElements.define('mh-brutalism-element', BrutalismElement);
