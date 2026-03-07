install-dependencies:
	@npm ci

qa: analyze typecheck test

typecheck: install-dependencies
	@npm run typecheck

analyze: install-dependencies
	@npm run analyze

test: install-dependencies
	@npm run test

build: install-dependencies
	@npm run build

.PHONY: qa \
				analyze \
				test \
				build \
				install-dependencies
