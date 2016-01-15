<button type="button" class="close pull-right" aria-hidden="true">&times;</button>
<div class="map-icon">
</div>

<div class="image-wrapper">
  <% if (getImage()) { %>
    <img src="<%= getImage() %>">
  <% } %>
</div>

<table class="table">
  <tr>
    <th>Coordinates:</th>
    <td><%= getFormatedCoords() %></td>
  </tr>

  <% properties().forEach(function(prop) { %>
  <tr>
    <th><%= t(prop) %></th>
    <td><%- get(prop) %></td>
  </tr>
  <% }); %>

</table>
