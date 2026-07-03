import { css, html } from 'lit';
import { state } from 'lit/decorators/state.js';
import { Component } from './litutil/Component.ts';
import { setTheme } from './services/theme.ts';

setTheme('default');

const sidebarItems = [
	{ id: 'home', label: 'Home' },
	{ id: 'about', label: 'About' },
	{ id: 'projects', label: 'Projects' },
	{ id: 'contact', label: 'Contact' },
];

const bottomSidebarItems = [
	{ id: 'settings', label: 'Settings' },
];

export class App extends Component {
	static styles = css`
		mh-background {
			z-index: -1;
		}

		.app {
			min-width: 50vw;
			min-height: 50vh;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.body {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			flex: 1;
		}

		.title {
			padding: 0.25rem 0.5rem;
		}

		.sidebar {
			min-width: 7rem;
		}

		.content {
			flex: 1;
			padding: 1rem;
			background-color: var(--bg-surface);
			border: var(--border-thin) solid var(--border-color);
		}
	`;

	@state()
	activeItemId: string | null = 'home';

	handleSidebarItemClickEvent(event: CustomEvent<{ id: string }>) {
		this.activeItemId = event.detail.id;
	}

	renderView() {
		switch (this.activeItemId) {
			case 'settings':
				return html`<mh-settings-view></mh-settings-view>`;
			default:
				return html`<div>Content for ${this.activeItemId}</div>`;
		}
	}

	render() {
		return html`
			<mh-background></mh-background>
			<mh-brutalism-element variant="bg-window" class="app">
				<div class="header">
					<mh-brutalism-element variant="pop-2" radius="sharp" color="main">
							<h1 class="title">
							matthias.harzer.dev
						</h1>
						</mh-brutalism-element>
				</div>
				<div class="body">
					<div class="sidebar">
						<mh-sidebar .items="${sidebarItems}" .bottomItems="${bottomSidebarItems}" .activeItemId="${this.activeItemId}" @sidebar-item-click="${this.handleSidebarItemClickEvent}"></mh-sidebar>
					</div>
					<div class="content">
						<div class="content-area">
							${this.renderView()}
						</div>
					</div>
				</div>
			</mh-brutalism-element>
		`;
	}
}

customElements.define('mh-app', App);
