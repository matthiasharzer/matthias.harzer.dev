import { css, html } from 'lit';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { Component } from './litutil/Component.ts';

export interface SidebarItem {
	id: string;
	label: string;
}

export class Sidebar extends Component {
	static styles = css`
		:host {
			display: block;
			height: 100%;
		}

		.sidebar {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.items-view {
			display: flex;
			flex-direction: column;
		}

		/* .top-items {
			flex: 1;
		} */

		.bottom-items {
			margin-top: auto;
		}

		button {
			background-color: transparent;
			border: none;
			padding: 0;
			margin: 0;
			font-family: var(--font-body);
			font-size: 1rem;
			cursor: pointer;
		}

		.item {
			padding: 0.5rem;
			text-align: left;
			font-weight: bold;
			transition: transform 0.1s ease-in-out;

			&.active {
				transform: rotate(var(--active-transform-angle));
				text-align: center;
			}
		}
	`;

	@property({ type: Array })
	items: SidebarItem[] = [];

	@property({ type: Array })
	bottomItems: SidebarItem[] = [];


	@property({ attribute: 'active-item-id' })
	activeItemId: string | null = null;

	@state()
	targetActiveTransformAngle: number = 0;

	constructor() {
		super();
		this.randomizeActiveTransformAngle();
	}

	variantOf(item: SidebarItem) {
		return this.activeItemId === item.id ? 'pop-2' : 'pop-1';
	}

	randomizeActiveTransformAngle() {
		const magnitude = 4 + Math.random() * 4;
		this.targetActiveTransformAngle = Math.random() < 0.5 ? -magnitude : magnitude;
	}

	handleSidebarItemClickEvent(item: SidebarItem) {
		this.dispatch('sidebar-item-click', { id: item.id })
		this.randomizeActiveTransformAngle();
	}

	renderElement(item: SidebarItem) {
		const isActive = this.activeItemId === item.id;

		return html`
			<mh-brutalism-button class="item ${isActive ? 'active' : ''}" @click="${() => this.handleSidebarItemClickEvent(item)}" ?disabled=${isActive} variant=${this.variantOf(item)}>
				${item.label}
			</mh-brutalism-button>
		`;
	}

	render() {
		return html`
			<style>
				:host {
					--active-transform-angle: ${this.targetActiveTransformAngle}deg;
				}
			</style>
			<div class="sidebar">
				<div class="items-view top-items">
					${this.items.map((item) => this.renderElement(item))}
				</div>
				<div class="items-view bottom-items">
					${this.bottomItems.map((item) => this.renderElement(item))}
				</div>
			</div>
		`;
	}
}

customElements.define('mh-sidebar', Sidebar);
