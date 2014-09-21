
build/test.js:
	@component build --standalone Sheet --dev --name test

test/index.html: build/test.js
	open $@

watch:
	@component build --standalone Sheet --dev --name test -w

.PHONY: build/test.js test/index.html watch
