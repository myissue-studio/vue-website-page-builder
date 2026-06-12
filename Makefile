update:
	@echo "Publishing new version to npm..."
	@chmod +x ./scripts/publish-to-npm.sh
	@./scripts/publish-to-npm.sh

dev:
	@chmod +x ./setup-local-dev.sh
	@./setup-local-dev.sh

.PHONY: update dev