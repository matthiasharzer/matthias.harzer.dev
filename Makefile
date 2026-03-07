install-dependencies:
	@npm ci

qa: analyze typecheck

typecheck: install-dependencies
	@npm run typecheck

analyze: install-dependencies
	@npm run analyze

build: install-dependencies
	@npm run build

.PHONY: qa \
				analyze \
				typecheck \
				build \
				install-dependencies
