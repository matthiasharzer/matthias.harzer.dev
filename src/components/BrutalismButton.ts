import { css, html } from 'lit';
import { property } from 'lit/decorators/property.js';
import { Component } from '../litutil/Component.ts';
import type { BorderWidthNames, InkNames, PopNames, RadiusNames } from '../services/theme.ts';

export class BrutalismButton extends Component {
	static styles = css`
		:host {
			display: inline-block;
		}

		button {
			all: unset;
			font-weight: 600;
			cursor: pointer;
		}

		mh-brutalism-element {
			padding: 0.5rem 1rem;
		}

		button:active mh-brutalism-element {
			box-shadow: 0px 0px 0px var(--shadow-color);
  		transform: translate(var(--shadow-offset-x), var(--shadow-offset-y));
		}
	`;

	@property()
	variant: PopNames = 'pop-1';

	@property()
	radius: RadiusNames = 'sharp';

	@property()
	color: InkNames = 'main';

	@property()
	border: BorderWidthNames = 'thick';

	@property({ type: Boolean, reflect: true })
	disabled: boolean = false;

	render() {
		return html`
			<button ?disabled=${this.disabled}>
				<mh-brutalism-element
					variant=${this.variant}
					radius=${this.radius}
					color=${this.color}
					border=${this.border}
				>
					<slot></slot>
				</mh-brutalism-element>
			</button>
		`;
	}
}

customElements.define('mh-brutalism-button', BrutalismButton);
