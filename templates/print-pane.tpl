<div id="print-header">
  <form class="print-options">
    <p><%= t("ui.print_pane.print_view_description") %></p>
    <div class="checkbox">
      <label>
        <input type="checkbox" value="show-large-map" checked>
        <%= t("ui.print_pane.show_large_map") %>
      </label>
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox" value="show-info" checked>
        <%= t("ui.print_pane.show_info_list") %>
      </label>
    </div>
    <div class="btn-group">
      <button type="button" class="btn btn-default cancel"><%= t("ui.print_pane.cancel") %></button>
      <button type="button" class="btn btn-primary print"><%= t("ui.print_pane.print") %></button>
    </div>
  </form>
</div>
<div id="print-pages">
  <div class="first-page">
    <h1><%= t("ui.print_pane.monitoring_report") %></h1>
    <div id="map-print"></div>
  </div>
  <div id="info-panes-print">
  <% infoPanes.forEach(function(infoPane) { %>
    <%= infoPane.$el.html() %>
  <% }); %>
  </div>
</div>
