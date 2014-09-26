test: build/test.js
	open $@/index.html

benchmark: build/test.js
	open test/$@.html

build/test.js:
	@component build --name test

watch:
	@component build --name test -w

.PHONY: build/test.js test watch benchmark
