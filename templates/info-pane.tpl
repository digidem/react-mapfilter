<div class="image-wrapper">
  <% if (getImage()) { %>
    <img src="">
    <div class="caption"><strong><%= t("ui.info_pane.caption") %></strong> <%= t(get("caption")) %></div>
  <% } %>
</div>

<table class="table">
  <tr>
    <th>Coordinates:</th>
    <td><%= getFormattedCoords() %></td>
  </tr>

  <% properties().forEach(function(prop) { %>
  <tr>
    <th><%= t(prop) %></th>
    <td><%- get(prop) %></td>
  </tr>
  <% }); %>

</table>
