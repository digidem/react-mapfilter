all: \
	dist/mapfilter.css \
	dist/mapfilter.min.css \
	dist/mapfilter.js \
	dist/mapfilter.min.js
  
dist/mapfilter.js: \
  js/mapfilter/mapfilter.js \
  js/mapfilter/collection.js \
  js/mapfilter/map_pane/map_pane.js \
  js/mapfilter/map_pane/marker_view.js \
  js/mapfilter/map_pane/current_view_info.js \
  js/mapfilter/info_pane/info_pane.js \
  js/mapfilter/filter_pane/filter_pane.js \
  js/mapfilter/filter_pane/discrete_filter_view.js \
  js/mapfilter/filter_pane/continuous_filter_view.js \
  js/mapfilter/filter_pane/graph_pane.js \
  js/mapfilter/filter_pane/bar_chart.js

dist/mapfilter.js: node_modules/.install Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@

dist/mapfilter.min.js: dist/mapfilter.js Makefile
	@rm -f $@
	node_modules/.bin/uglifyjs $< -c -m -o $@

dist/mapfilter.css: \
	css/bootstrap.css \
	css/chart.css \
	css/core.css \
	css/leaflet.css

dist/mapfilter.css: Makefile
	@rm -f $@
	cat $(filter %.css,$^) > $@

dist/mapfilter.min.css: dist/mapfilter.css Makefile
	@rm -f $@
	node_modules/.bin/cleancss -o $@ $<

node_modules/.install: package.json
	npm install && touch node_modules/.install
  
clean:
	rm -f dist/mapfilter*.js dist/mapfilter*.css

D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/core/index.js \
	node_modules/d3/src/svg/brush.js \
	node_modules/d3/src/time/format.js \
	node_modules/d3/src/time/interval.js \
	node_modules/d3/src/time/scale.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/scale/linear.js \
	node_modules/d3/src/svg/axis.js \
	node_modules/d3/src/format/format.js \
	node_modules/d3/src/end.js

js/lib/d3.v3.js: $(D3_FILES)
	node_modules/.bin/smash $(D3_FILES) > $@

js/lib/bing_layer.js:
	curl https://raw.github.com/shramov/leaflet-plugins/master/layer/tile/Bing.js -o $@

js/lib/leaflet_providers.js:
	curl https://raw.github.com/leaflet-extras/leaflet-providers/master/leaflet-providers.js -o $@
