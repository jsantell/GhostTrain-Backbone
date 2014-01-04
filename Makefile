BROWSERIFY=./node_modules/browserify/bin/cmd.js
UGLIFY=./node_modules/uglify-js/bin/uglifyjs

all: browserify min

browserify:
	mkdir -p ./dist
	node $(BROWSERIFY) --standalone GhostTrainBackbone ./index.js > ./dist/ghosttrain.backbone.js
	
	# Create test bundle
	mkdir -p ./build
	node $(BROWSERIFY) ./test/test.*.js > ./build/test-bundle.js

min:
	node $(UGLIFY) ./dist/ghosttrain.backbone.js -o ./dist/ghosttrain.backbone.min.js

.PHONY: browserify min
