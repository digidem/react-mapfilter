D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/core/index.js \
	node_modules/d3/src/svg/brush.js \
	node_modules/d3/src/time/format.js \
	node_modules/d3/src/time/interval.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/scale/linear.js \
	node_modules/d3/src/svg/axis.js \
	node_modules/d3/src/format/format.js \
	node_modules/d3/src/end.js

js/lib/d3.v3.js: $(D3_FILES)
	node_modules/.bin/smash $(D3_FILES) > $@