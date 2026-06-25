token:
	@echo ""
	@echo "Generate a new npm token at:"
	@echo "https://www.npmjs.com/settings/$(shell npm whoami 2>/dev/null || echo '<your-npm-username>')/tokens/granular-access-tokens/new"
	@echo ""
	@echo "Settings: Read & write access, bypass 2FA, max expiration"
	@echo ""
	@echo "⚠️  Paste ONLY the token (starting with 'npm_'), NOT the word 'Token'!"
	@echo ""
	@read -p "Paste your token here: " token && \
	token=$$(echo "$$token" | sed 's/^[Tt]oken[[:space:]]*//') && \
	(echo "//registry.npmjs.org/:_authToken=$$token" > ~/.npmrc && \
	echo "registry=https://registry.npmjs.org/" >> ~/.npmrc && \
	echo "✓ Token saved to ~/.npmrc" && \
	echo "" && \
	npm whoami && \
	echo "✓ Authentication verified!")

update:
	@echo "Publishing new version to npm..."
	@chmod +x ./scripts/publish-to-npm.sh
	@./scripts/publish-to-npm.sh

dev:
	@chmod +x ./setup-local-dev.sh
	@./setup-local-dev.sh

.PHONY: token update dev