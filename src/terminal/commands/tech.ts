import {
	type Command,
	group,
	linebreak,
	link,
	list,
	paragraph,
	plainCommand,
	text,
} from '../terminal.ts';

const tech: Command = {
	name: 'tech',
	description: 'Lists technologies, I use for development',
	prepare: plainCommand(() => {
		return [
			paragraph([
				'I have experience in building front- and backend applications with a variety of technologies.',
			]),
			paragraph([
				text('On the frontend, I enjoy working with '),
				list(
					[
						link('Lit', 'https://lit.dev/', 'lit'),
						link('Next.js', 'https://nextjs.org/', 'nextjs'),
						link('Svelte', 'https://svelte.dev/', 'svelte'),
						link('Vue', 'https://vuejs.org/', 'vue'),
						link('Flutter', 'https://flutter.dev/', 'flutter'),
					],
					'unordered',
				),
			]),
			linebreak(),
			paragraph([
				text('On the backend, I have experience with '),
				list(
					[
						link('Go', 'https://go.dev/', 'go'),
						linebreak(),
						group([
							link('FastAPI', 'https://fastapi.tiangolo.com/', 'fastapi'),
							text(' / '),
							link('Python', 'https://www.python.org/', 'python'),
						]),
						group([
							link('Node.js', 'https://nodejs.org/', 'node'),
							text(' / '),
							link('TypeScript', 'https://www.typescriptlang.org/', 'typescript'),
						]),
						link('Java', 'https://www.java.com/', 'java'),
						link('C#', 'https://dotnet.microsoft.com/en-us/languages/csharp/', 'cs'),
					],
					'unordered',
				),
			]),
			paragraph([
				text('I also have experience with '),
				list(
					[
						link('Docker', 'https://www.docker.com/', 'docker'),
						link(
							'CI/CD pipelines',
							'https://www.redhat.com/en/topics/devops/what-is-ci-cd',
							'cicd',
						),
						link(
							'Event Sourcing',
							'https://docs.eventsourcingdb.io/about-eventsourcingdb/introduction-to-event-sourcing/',
							'eventsourcing',
						),
						link('CQRS', 'https://www.cqrs.com/concepts/cqrs/', 'cqrs'),
						link('Domain-Driven Design', 'https://www.domainlanguage.com/ddd/', 'ddd'),
					],
					'unordered',
				),
			]),
		];
	}),
};

export default tech;
