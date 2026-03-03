import { css, html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { Component } from './litutil/Component.ts';
import { renderResponse, renderResponsePart } from './terminal/renderer.ts';
import type { TerminalResponse } from './terminal/terminal.ts';

export class TerminalResponseItem extends Component {
	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: 0.2em;
			padding: 0.2em 0;
		}

		.response {
			position: relative;

			.placeholder-render {
				visibility: hidden;
			}

			.command-response {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
			}
		}

		.linebreak {
			display: block;
		}

		.highlight {
			color: #fd63f8;

			&.underline {
				color: inherit;
				text-decoration: underline;
			}

			&.lit {
				color: #4c64ff;
			}

			&.go {
				color: #00add8;
			}

			&.svelte {
				color: #f96743;
			}

			&.vue {
				color: #41b883;
			}

			&.node {
				color: #8cc84b;
			}

			&.python {
				color: #3572a5;
			}

			&.flutter {
				color: #31b9f6;
			}

			&.fastapi {
				color: #009485;
			}

			&.nextjs {
				color: #000000;
				text-shadow: -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 1px 1px 0 #808080;
			}

			&.java {
				color: #b07219;
			}

			&.cs {
				color: #178600;
			}

			&.error {
				color: #ff5555;
			}

			&.rainbow {
				background: linear-gradient(90deg,
						#ff2c55,
						#ff6555,
						#ffaa55,
						#ffd955,
						#ffee55,
						#d4ff55,
						#8cff55,
						#55ff6e,
						#55ffb9,
						#55ffea,
						#55f7ff,
						#55c4ff,
						#5581ff,
						#5557ff,
						#7a55ff,
						#b355ff,
						#e355ff,
						#ff55f0,
						#ff55b5,
						#ff558a,
						#ff5564,
						#ff5549);
				-webkit-background-clip: text;
				background-clip: text;
				-webkit-text-fill-color: transparent;
			}

			&.hka, &.isrg {
				color: #d72305;
			}

			&.simpleagridata {
				color: #f59224;
			}

			&.thenativeweb {
				color: #dd0099;
			}

			&.inovex {
				color: #051c59 ;
				--shadow-color: hsl(223.57, 19.36%, 28.43%);
				text-shadow: -1px -1px 0 var(--shadow-color), 1px -1px 0 var(--shadow-color), -1px 1px 0 var(--shadow-color), 1px 1px 0 var(--shadow-color);

			}

			&.cqrs {
				color: #ffc929;
			}

			&.ddd {
				color: #ff6f00;
			}

			&.eventql,
			&.eventsourcing,
			&.eventsourcingdb {
				color: #25a55a;
			}

			&.smartreadinessindicator {
				color: #1d88cc
			}

			&.kit,
			&.tmb {
				color: #009682;
			}

			&.career-dates {
				color: #757575;
  			font-weight: lighter;
			}


			&.config-key {
				color: #ff79c6;
			}

			&.config-value {
				color: #f1fa8c;
			}
		}

		a.highlight {
			color: #bd93f9;
		}

		a, button {
			position: relative;

			text-decoration: none;
			background-image: linear-gradient(currentColor, currentColor);
			background-position: 0% 100%;
			background-repeat: no-repeat;
			background-size: 0% 2px;
			transition: background-size .3s;

			&:hover,
			&:focus {
				background-size: 100% 2px;
			}
		}

		button {
			background-color: transparent;
			border: none;
			color: inherit;
			font-family: inherit;
			font-size: inherit;
			cursor: pointer;
			padding: 0;
			margin: 0;
		}

		.indentation {
			&.0 {
				margin-left: 0;
			}

			&.l-1 {
				margin-left: 20px;
			}

			&.l-2 {
				margin-left: 40px;
			}

			&.l-3 {
				margin-left: 60px;
			}

			&.l-4 {
				margin-left: 80px;
			}
		}

		p {
			padding: 0.3em 0.3em 0 0.3em;

			&:last-child {
				padding-bottom: 0.3em;
			}
		}

		hr {
			border: none;
			border-top: 1px solid #44475a;
			margin: 0.5em 0;
		}

		.hover-highlight-block {
			background-color: transparent;

			transition: background-color 0.2s;

			&:hover {
				background-color: rgba(68, 71, 90, 0.3);
			}
		}

		.pixel-emoji{
			display: inline-block;
			max-width: 1em;
			max-height: 1em;
			vertical-align: middle;
			padding-bottom: 0.15em;

			image-rendering: pixelated;
			image-rendering: -moz-crisp-edges;
			image-rendering: -o-crisp-edges;
			image-rendering: -webkit-optimize-contrast;
			image-rendering: optimize-contrast;
		}
	`;

	@property({ attribute: false }) result: TerminalResponse = [];
	@property({ type: Number, attribute: 'typewriter-chars-per-second' }) typewriterCharsPerSecond =
		-1;

	@state() _displayedContent: TemplateResult | TemplateResult[] = html``;
	#placeholderRender: TemplateResult | TemplateResult[] = html``;

	connectedCallback(): void {
		super.connectedCallback();
		this.#placeholderRender = renderResponse(this.result);

		if (this.typewriterCharsPerSecond <= 0) {
			this._displayedContent = this.#placeholderRender;
			return;
		}
		this.runTypeWriterEffect();
	}

	runTypeWriterEffect() {
		let lastTime = 0;

		let numberOfCharsToRender = 0;

		const frame = (time: DOMHighResTimeStamp) => {
			if (lastTime === 0) {
				lastTime = time;
				requestAnimationFrame(frame);
				return;
			}

			const delta = time - lastTime;
			const charsToAdd = Math.floor((delta / 1000) * this.typewriterCharsPerSecond);
			if (charsToAdd === 0) {
				requestAnimationFrame(frame);
				return;
			}

			const renderedParts: TemplateResult[] = [];

			numberOfCharsToRender += charsToAdd;
			let remainingCharsToRender = numberOfCharsToRender;
			for (let i = 0; i < this.result.length; i++) {
				const part = this.result[i];
				const [renderedPart, partLength] = renderResponsePart(part, remainingCharsToRender);
				renderedParts.push(renderedPart);

				remainingCharsToRender -= partLength;
				if (remainingCharsToRender <= 0) {
					break;
				}
			}

			this._displayedContent = renderedParts;
			if (remainingCharsToRender > 0) {
				// finished, because there are still chars available, but no more parts to render
				return;
			}

			lastTime = time;
			requestAnimationFrame(frame);
		};

		requestAnimationFrame(frame);
	}

	render() {
		return html`
			<div class="response">
				<div class="placeholder-render">
					${this.#placeholderRender}
				</div>
				<div class="command-response">
					${this._displayedContent}
				</div>
			</div>
		`;
	}
}

customElements.define('mh-terminal-response-item', TerminalResponseItem);
