<h3>
  <%= t(getPlacename()) %><br>
  <small><%= getWhat() === "Not Recorded" ? "Other" : getWhat() %></small>
</h3>
<div class="image-wrapper">
  <% if (getImage()) { %>
    <img src="<%= getImage() %>">
    <div class="caption"><strong>Caption:</strong> <%= t(get("caption")) %></div>
  <% } %>
</div>
<table class="table">
<tr>
  <th>Where:</th>
  <td><%= t(getLocation()) %></td>
</tr>
<tr>
  <th>Coordinates:</th>
  <td><%= getFormattedCoords() %></td>
</tr>
<tr>
  <th>Impacts:</th>
  <td><%= t(getImpacts()) %></td>
</tr>
<% if (attributes.other_info) { %>
<tr>
  <th>Notes:</th>
  <td><%= attributes.other_info %></td>
</tr>
<% } %>
<tr>
  <th>Visited&nbsp;by:</th>
  <td><%= getWho() %></td>
</tr>
<tr>
  <th>Visit&nbsp;date:</th>
  <td><%= getWhen() %></td>
</tr>
</table>
