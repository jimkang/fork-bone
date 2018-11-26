BROWSERIFYCMD = node_modules/.bin/browserify -d 

SMOKEFIREFOX = node_modules/.bin/tap-closer | \
	node_modules/.bin/smokestack -b firefox

test-firefox:
	$(BROWSERIFYCMD) tests/basictests.js | $(SMOKEFIREFOX)

test:
	node tests/basictests.js

pushall:
	git push origin gh-pages && npm publish

prettier:
	prettier --single-quote --write "**/*.js"

