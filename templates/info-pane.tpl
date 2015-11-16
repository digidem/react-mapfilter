<button type="button" class="close pull-right" aria-hidden="true">&times;</button>
<div class="map-icon">
</div>
<h3>
  <%= t(getPlacename()) %><br>
  <small><%= getWhat() === "Not Recorded" ? t("ui.info_pane.other") : getWhat() %></small>
</h3>
<div class="image-wrapper">
  <% if (getImgUrl()) { %>
    <img src="/monitoring-files/<%= getImgUrl() %>">
    <div class="caption"><strong><%= t("ui.info_panel.prompt.caption") %>:</strong> <%= getImgCaption() %></div>
  <% } %>
</div>
<table class="table">
<tr>
  <th><%= t("ui.info_panel.prompt.location") %>:</th>
  <td><%= t(getLocation()) %></td>
</tr>
<tr>
  <th><%= t("ui.info_panel.prompt.coordinates") %>:</th>
  <td><%= getFormatedCoords() %></td>
</tr>
<tr>
  <th><%= t("ui.info_panel.prompt.impacts") %>:</th>
  <td><%= t(getImpacts()) %></td>
</tr>
<% if (attributes.other_info) { %>
<tr>
  <th><%= t("ui.info_panel.prompt.notes") %>:</th>
  <td><%= attributes.other_info %></td>
</tr>
<% } %>
<tr>
  <th><%= t("ui.info_panel.prompt.visited_by") %>:</th>
  <td><%= getWho() %></td>
</tr>
<tr>
  <th><%= t("ui.info_panel.prompt.visit_date") %>:</th>
  <td><%= getWhen() %></td>
</tr>
</table>
