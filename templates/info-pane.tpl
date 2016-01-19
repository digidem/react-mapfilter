<button type="button" class="close pull-right" aria-hidden="true">&times;</button>
<div class="map-icon">
</div>
<h3>
  <%= t(getPlacename()) %><br>
  <small><%= getWhat() === "Not Recorded" ? t("ui.info_pane.other") : getWhat() %></small>
</h3>
<div class="image-wrapper">
  <% if (getImage()) { %>
    <img src="<%= getImage() %>">
    <div class="caption"><strong><%= t("ui.info_pane.caption") %></strong> <%= t(get("caption")) %></div>
  <% } %>
</div>
<table class="table">
<tr>
  <th><%= t("ui.info_pane.location") %>:</th>
  <td><%= t(getLocation()) %></td>
</tr>
<tr>
  <th><%= t("ui.info_pane.coordinates") %>:</th>
  <td><%= getFormatedCoords() %></td>
</tr>
<tr>
  <th><%= t("ui.info_pane.impacts") %>:</th>
  <td><%= t(getImpacts()) %></td>
</tr>
<% if (attributes.other_info) { %>
<tr>
  <th><%= t("ui.info_pane.notes") %>:</th>
  <td><%= attributes.other_info %></td>
</tr>
<% } %>
<tr>
  <th><%= t("ui.info_pane.visited_by") %>:</th>
  <td><%= getWho() %></td>
</tr>
<tr>
  <th><%= t("ui.info_pane.visit_date") %>:</th>
  <td><%= getWhen() %></td>
</tr>
</table>
