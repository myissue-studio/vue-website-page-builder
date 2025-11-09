update:
	@echo "Publishing new version to npm..."
	@chmod +x ./scripts/publish-to-npm.sh
	@./scripts/publish-to-npm.sh

.PHONY: update