import type { Terminal } from '../../Terminal.ts';
import {
	button,
	type Command,
	highlight,
	hoverHighlightBlock,
	hr,
	indentation,
	linebreak,
	link,
	paragraph, type TerminalItem,
	text
} from '../terminal.ts';

interface CareerEntry {
	title: TerminalItem,
	startDate: Date,
	endDate?: Date,
	description: TerminalItem[],
}

const careerEntries: CareerEntry[] = [
	{
		title: link('inovex', 'https://www.inovex.de/', 'inovex'),
		startDate: new Date(2026, 2), // March 2026
		endDate: new Date(2026, 7),   // August 2026
		description: [
			paragraph([
				text('Internship in IT Engineering & Operations with a focus on agile software development.'),
				// text('Implementation of project infrastructure, including build pipelines and automated testing within a Scrum process.')
			]),
		],

	},
	{
		title: link('Hochschule Karlsruhe', 'https://www.h-ka.de/', 'hka'),
		startDate: new Date(2025, 9), 			// October 2025
		endDate: new Date(2026, 1),         // February 2026
		description: [
			paragraph([
				text('Student assistant at the '),
				link('Intelligent Systems Research Group', 'https://www.h-ka.de/isrg', 'isrg'),
				text('.'),
			]),
			paragraph([
				text('Development of the front- and backend of the '),
				link('SimpleAgriData', 'https://simple-agri-data.de/', 'simpleagridata'),
				text(' Stallkarten app using '),
				link('FastAPI', 'https://fastapi.tiangolo.com/', 'fastapi'),
				text(' and '),
				link('Next.js', 'https://nextjs.org/', 'nextjs'),
				text('.'),
			]),
		],
	},
	{
		title: link('the native web GmbH', 'https://thenativeweb.io/', 'thenativeweb'),
		startDate: new Date(2024, 4), // May 2024
		endDate: new Date(2025, 6),   // July 2025
		description: [
			paragraph([
				text('Working student for back- & frontend development using '),
				link('Lit', 'https://lit.dev/', 'lit'),
				text(' and '),
				link('Go', 'https://go.dev/', 'go'),
				text(' with a focus on '),
				link(
					'Event Sourcing',
					'https://docs.eventsourcingdb.io/about-eventsourcingdb/introduction-to-event-sourcing/',
					'eventsourcing',
				),
				text(', '),
				link('CQRS', 'https://www.cqrs.com/concepts/cqrs/', 'cqrs'),
				text(' and '),
				link('Domain-Driven Design', 'https://www.domainlanguage.com/ddd/', 'ddd'),
				text('.'),
			]),
			paragraph([
				text('I was the primary engineer of '),
				link('EventQL', 'https://docs.eventsourcingdb.io/reference/eventql/', 'eventql'),
				text(', a purpose-built query language of the '),
				link('EventSourcingDB', 'https://eventsourcingdb.io/', 'eventsourcingdb'),
				text('.'),
			]),
		],
	},
	{
		title: link('Karlsruhe Institute of Technology', 'https://www.kit.edu/', 'kit'),
		startDate: new Date(2023, 5), // June 2023
		endDate: new Date(2024, 1),   // February 2024
		description: [
			paragraph([
				text('Student assistant at the '),
				link(
					'Institute of Technology and Management in Construction',
					'https://www.tmb.kit.edu/',
					'tmb',
				),
				text('.'),
			]),
			paragraph([
				text('Development of the '),
				link(
					'Smart Readiness Indicator',
					'https://smartreadinessindicator.com/',
					'smartreadinessindicator',
				),
				text(' web platform using '),
				link('Vue', 'https://vuejs.org/', 'vue'),
				text(' and '),
				link('Node.js', 'https://nodejs.org/', 'node'),
				text('.'),
			]),
		],
	},
]

const formatDate = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
	return date.toLocaleDateString('en-US', options);
}

const formatDateRange = (startDate: Date, endDate?: Date): string => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);


	if (startDate > today) {
		return `starting ${formatDate(startDate)}`;
	}

	if (!endDate) {
		return `since ${formatDate(startDate)}`;
	}

	const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
	if (endOfMonth > today) {
		return `since ${formatDate(startDate)}`;
	}

	if (endOfMonth < today) {
		return `${formatDate(startDate)} - ${formatDate(endDate)}`;
	} else {
		return `since ${formatDate(startDate)}`;
	}
}



const ENTRIES_PER_PAGE = 3;

const renderEntry = (entry: CareerEntry): TerminalItem => {
	const items: TerminalItem[] = [];
	items.push(
		paragraph([
			entry.title,
			highlight(` (${formatDateRange(entry.startDate, entry.endDate)})`, 'career-dates'),
		]),
	);
	entry.description.forEach((desc) => {
		items.push(desc);
	});
	return hoverHighlightBlock(items);
}

const renderPageIndex = (page: number): TerminalItem[] => {
	const startIndex = page * ENTRIES_PER_PAGE;
	const endIndex = startIndex + ENTRIES_PER_PAGE;
	const nonFutureEntries = careerEntries.filter(entry => entry.startDate <= new Date() || true);
	const entries = nonFutureEntries.slice(startIndex, endIndex);

	const items: TerminalItem[] = [];
	entries.forEach((entry, index) => {
		if (index > 0) {
			items.push(linebreak(0.5));
		}
		items.push(renderEntry(entry));
	});
	return items;
}

const buildPageSelector = (terminal: Terminal, currentPage: number, totalPages: number): TerminalItem[] => {
	const items: TerminalItem[] = [];

	items.push(text('Page: '));

	if (currentPage > 1) {
		items.push(button('<<', () => {
			terminal.insertAndExecuteCommand("career", String(currentPage - 1));
		}));
	}

	items.push(
		text(' '),
		highlight(String(currentPage), "underline"),
		text(" / "),
		text(`${totalPages} `)
	);

	if (currentPage < totalPages) {
		items.push(button('>>', () => {
			terminal.insertAndExecuteCommand("career", String(currentPage + 1));
		}));
	}

	return items
}


const career: Command = {
	name: 'career',
	description: 'Displays my career so far',
	prepare: (terminal) => (page: string = "1") => {
		const pageNumber = Number.parseInt(page, 10) || 1;
		const totalPages = Math.ceil(careerEntries.length / ENTRIES_PER_PAGE);

		if (pageNumber < 1 || pageNumber > totalPages) {
			return [
				text(`Invalid page number. Please enter a number between 1 and ${totalPages}.`),
			];
		}

		const introItems: TerminalItem[] = []

		if (pageNumber === 1) {
			introItems.push(
				text("I'm studying at the "),
				link('Hochschule Karlsruhe', 'https://www.h-ka.de/', 'hka'),
				text(' and have been active as a working student:'),
				linebreak(0.5),
			);
		}

		return [
			...introItems,
			indentation(2, [
				...renderPageIndex(pageNumber - 1),
				paragraph([
					hr(),
					...buildPageSelector(terminal, pageNumber, totalPages),
				])
			]),
		];
	},
};

export default career;
